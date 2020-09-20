import React, { useMemo, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { gql, useQuery } from '@apollo/client';
import Select from 'antd/lib/select';
import { connectField, filterDOMProps, useForm } from 'uniforms';
import { wrapField } from 'uniforms-antd';

import debounce from 'lodash/debounce';

const { Option } = Select;

export const createCrossReferenceSearchFieldQueries = ({
  query,
  edges,
  labelKey,
  valueKey,
  idType,
}) => ({
  search: gql`
        query searchData($search: String) {
          ${query}(pageSize: 10, search: $search) {
            ${edges ? edges + ' {' : ''}
              ${labelKey}
              ${valueKey}
            ${edges ? '}' : ''}
          }
        }`,
  initialValue: gql`
        query searchData($_ids: [${idType}]) {
          ${query}(_ids: $_ids) {
            ${edges ? edges + ' {' : ''}
              ${labelKey}
              ${valueKey}
            ${edges ? '}' : ''}
          }
        }`,
});

const CrossReferenceSearchField = (props) => {
  const {
    id,
    query,
    labelKey,
    valueKey,
    initialLabelKey,
    initialSearch,
    idType,
    name,
    value: initialValue,
    placeholder,
    disabled,
    edges,
    multiple,
  } = props;

  // console.log(uniforms, props);
  const uniforms = useForm();

  const [search, setSearch] = useState(initialSearch);
  const [value, setValue] = useState(null);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const selectRef = useRef(null);

  if (!value && initialLabelKey && initialValue) {
    const nameParts = name.split('.');
    nameParts.pop();
    nameParts.push(initialLabelKey);

    let label = uniforms.model;
    for (let i = 0; i < nameParts.length; i++) {
      const namePart = nameParts[i];
      if (label[namePart]) {
        label = label[namePart];
      } else {
        label = null;
        break;
      }
    }
    if (label instanceof Array) {
      setLoadingComplete(true);
      setValue(
        label.map((item, index) => ({
          key: initialValue[index],
          label: item[labelKey],
        })),
      );
    } else if (label && label[labelKey]) {
      setLoadingComplete(true);
      setValue({
        key: initialValue,
        label: label[labelKey],
      });
    }
  }

  const gqlQueries = useMemo(() => {
    return createCrossReferenceSearchFieldQueries(props);
  }, [query, labelKey, valueKey]);

  const { loading, error, data } = useQuery(gqlQueries.search, {
    variables: { search },
    skip: !search,
    fetchPolicy: 'cache-and-network', // network-only
    // onCompleted: () => console.log('complete'),
  });

  //console.log({ search, loading, error, data });

  const { loading: loading2, error: error2 } = useQuery(gqlQueries.initialValue, {
    variables: { _ids: initialValue },
    skip: !!value || !initialValue || loadingComplete,
    // fetchPolicy: 'cache-and-network', // network-only
    onCompleted: (result) => {
      if (!result) {
        // @todo figure out why this is problem https://github.com/apollographql/react-apollo/issues/3943
        if (!!value || !initialValue || loadingComplete) {
          console.log('this should be skipped. is apollo broken?');
          return;
        }
        console.log('inital value not found', initialValue);
        return;
      }
      console.log(idType, result, query, edges);
      setLoadingComplete(true);
      const resultEdges = edges ? result[query][edges] : result[query];
      if (resultEdges && resultEdges.length) {
        const values = resultEdges.map((item) => ({
          key: item[valueKey],
          label: item[labelKey],
        }));
        setValue(multiple ? values : values[0]);
        console.log('finished Query for Label', multiple ? values : values[0]);
      }
    },
  });

  function handleSearch(newValue) {
    setSearch(newValue);
  }

  function handleChange(newValue) {
    // console.log(newValue);
    setValue(newValue);
    setSearch('');
    if (newValue) {
      props.onChange(multiple ? newValue.map((item) => item.key) : newValue.key);
      // selectRef.current.blur();
    }
  }
  // eslint-disable-next-line
  const searchData = data && data[query] ? (edges ? data[query][edges] : data[query]) : [];

  return wrapField(
    props,
    <Select
      id={id}
      name={name}
      disabled={disabled}
      filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      // filterOption={false}
      labelInValue
      loading={loading || loading2}
      mode={multiple ? 'multiple' : 'default'}
      onChange={handleChange}
      onSearch={debounce(handleSearch, 350)}
      optionFilterProp="children"
      placeholder={placeholder}
      ref={selectRef}
      showSearch
      value={value || undefined}
    >
      {searchData.map((item) => (
        <Option key={item[valueKey]}>{item[labelKey]}</Option>
      ))}
    </Select>,
  );
};

CrossReferenceSearchField.defaultProps = {
  label: '',
  id: undefined,
  value: undefined,
  edges: undefined,
  placeholder: null,
  disabled: false,
  multiple: false,
  idType: 'ObjectID',
  initialSearch: '',
};

CrossReferenceSearchField.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  disabled: PropTypes.bool,
  query: PropTypes.string.isRequired,
  edges: PropTypes.string.isRequired,
  labelKey: PropTypes.string.isRequired,
  valueKey: PropTypes.string.isRequired,
  multiple: PropTypes.bool,
  idType: PropTypes.string,
  initialSearch: PropTypes.string,
};

// CrossReferenceSearchField.contextTypes = BaseField.contextTypes;

export default connectField(CrossReferenceSearchField);

filterDOMProps.register(
  'query',
  'edges',
  'primaryKeyField',
  'labelKey',
  'valueKey',
  'multiple',
  'queryParameters',
  'initalValueKey',
  'initialSearch',
);
