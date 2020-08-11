import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import Select from 'antd/lib/select';
import { connectField, filterDOMProps } from 'uniforms';
import { wrapField } from 'uniforms-antd';
import gql from 'graphql-tag';

const { Option } = Select;

const CrossReferenceSelectField = (props) => {
  const {
    query,
    labelKey,
    valueKey,
    value: initalValue,
    placeholder,
    disabled,
    edges,
    multiple,
  } = props;

  const [value, setValue] = useState(initalValue);

  // console.log(`
  // query selectData {
  //   ${query}(pageSize: 100) {
  //     ${edges ? edges + ' {' : ''}
  //       ${labelKey}
  //       ${valueKey}
  //     ${edges ? '}' : ''}
  //   }
  // }`);

  const gqlQuery = useMemo(() => {
    return gql`
        query selectData {
          ${query}(pageSize: 100) {
            ${edges ? edges + ' {' : ''}
              ${labelKey}
              ${valueKey}
            ${edges ? '}' : ''}
          }
        }`;
  }, [query, labelKey, valueKey]);

  const { loading, error, data } = useQuery(gqlQuery);

  function handleChange(newValue) {
    setValue(newValue);
    if (newValue) {
      props.onChange(newValue);
    }
  }
  // eslint-disable-next-line
  const selectData = data ? (edges ? data[query][edges] : data[query]) : [];

  return wrapField(
    props,
    <Select
      showSearch
      value={value || undefined}
      placeholder={placeholder}
      onChange={handleChange}
      loading={loading}
      mode={multiple ? 'multiple' : 'default'}
      // style={{ width: '100%' }}
      disabled={disabled}
      optionFilterProp="children"
      filterOption={(input, option) =>
        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {selectData.map((item) => (
        <Option key={item[valueKey]}>{item[labelKey]}</Option>
      ))}
    </Select>,
  );
};

CrossReferenceSelectField.defaultProps = {
  label: '',
  // id: undefined,
  value: undefined,
  edges: undefined,
  placeholder: null,
  disabled: false,
  multiple: false,
};

CrossReferenceSelectField.propTypes = {
  // id: PropTypes.string,
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
};

export default connectField(CrossReferenceSelectField);

filterDOMProps.register('query', 'edges', 'primaryKeyField', 'labelKey', 'valueKey', 'multiple');
