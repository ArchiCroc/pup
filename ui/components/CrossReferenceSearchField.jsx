import React, { useMemo, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import Select from 'antd/lib/select';
import connectField from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';
import wrapField from 'uniforms-antd/wrapField';

import debounce from 'lodash/debounce';
import gql from 'graphql-tag';

const { Option } = Select;

const CrossReferenceSearchField = (props) => {
  const {
    query,
    labelField,
    valueField,
    value: initialValue,
    placeholder,
    disabled,
    edges,
    multiple,
  } = props;

  const [search, setSearch] = useState('');
  const [value, setValue] = useState(null);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const selectRef = useRef(null);

  // console.log(`
  // query searchData($search: String) {
  //   ${query}(pageSize: 10, search: $search) {
  //     ${edges ? edges + ' {' : ''}
  //       ${labelField}
  //       ${valueField}
  //     ${edges ? '}' : ''}
  //   }
  // }`);

  const gqlQueries = useMemo(() => {
    return {
      search: gql`
        query searchData($search: String) {
          ${query}(pageSize: 10, search: $search) {
            ${edges ? edges + ' {' : ''}
              ${labelField}
              ${valueField}
            ${edges ? '}' : ''}
          }
        }`,
      initialValue: gql`
        query searchData($_ids: [String]) {
          ${query}(_ids: $_ids) {
            ${edges ? edges + ' {' : ''}
              ${labelField}
              ${valueField}
            ${edges ? '}' : ''}
          }
        }`,
    };
  }, [query, labelField, valueField]);

  const { loading, error, data } = useQuery(gqlQueries.search, {
    variables: { search },
    skip: !search,
    fetchPolicy: 'cache-and-network', // network-only
    onCompleted: () => console.log('complete'),
  });

  const { loading: loading2 } = useQuery(gqlQueries.initialValue, {
    variables: { _ids: initialValue },
    skip: !initialValue || loadingComplete,
    // fetchPolicy: 'cache-and-network', // network-only
    onCompleted: (result) => {
      setLoadingComplete(true);
      const resultEdges = edges ? result[query][edges] : result[query];
      if (resultEdges && resultEdges.length) {
        const values = resultEdges.map((item) => ({
          key: item[valueField],
          label: item[labelField],
        }));
        setValue(multiple ? values : values[0]);
        console.log('complete2', multiple ? values : values[0]);
      }
    },
  });

  function handleSearch(newValue) {
    setSearch(newValue);
  }

  function handleChange(newValue) {
    console.log(newValue);
    setValue(newValue);
    setSearch('');
    if (newValue) {
      props.onChange(multiple ? newValue.map((item) => item.key) : newValue.key);
      // selectRef.current.blur();
    }
  }
  // eslint-disable-next-line
  const searchData = data ? (edges ? data[query][edges] : data[query]) : [];

  return wrapField(
    props,
    <Select
      disabled={disabled}
      filterOption={(input, option) =>
        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
        <Option key={item[valueField]}>{item[labelField]}</Option>
      ))}
    </Select>,
  );
};

CrossReferenceSearchField.defaultProps = {
  label: '',
  // id: undefined,
  value: undefined,
  edges: undefined,
  placeholder: null,
  disabled: false,
  multiple: false,
};

CrossReferenceSearchField.propTypes = {
  // id: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  disabled: PropTypes.bool,
  query: PropTypes.string.isRequired,
  edges: PropTypes.string.isRequired,
  labelField: PropTypes.string.isRequired,
  valueField: PropTypes.string.isRequired,
  multiple: PropTypes.bool,
};

export default connectField(CrossReferenceSearchField);

filterDOMProps.register(
  'query',
  'edges',
  'primaryKeyField',
  'labelField',
  'valueField',
  'multiple',
);
