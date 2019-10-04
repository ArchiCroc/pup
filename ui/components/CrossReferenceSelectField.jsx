import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import Select from 'antd/lib/select';
import connectField from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';
import wrapField from 'uniforms-antd/wrapField';
import gql from 'graphql-tag';

const { Option } = Select;

const CrossReferenceSelectField = (props) => {
  const { query, labelField, valueField, value: initalValue, placeholder, disabled, edges } = props;

  const [value, setValue] = useState(initalValue);

  // console.log(`
  // query selectData {
  //   ${query}(pageSize: 100) {
  //     ${edges ? edges + ' {' : ''}
  //       ${labelField}
  //       ${valueField}
  //     ${edges ? '}' : ''}
  //   }
  // }`);

  const gqlQuery = useMemo(() => {
    return gql`
        query selectData {
          ${query}(pageSize: 100) {
            ${edges ? edges + ' {' : ''}
              ${labelField}
              ${valueField}
            ${edges ? '}' : ''}
          }
        }`;
  }, [query, labelField, valueField]);

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
      // style={{ width: '100%' }}
      disabled={disabled}
      optionFilterProp="children"
      filterOption={(input, option) =>
        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {selectData.map((item) => (
        <Option key={item[valueField]}>{item[labelField]}</Option>
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
};

CrossReferenceSelectField.propTypes = {
  // id: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  query: PropTypes.string.isRequired,
  edges: PropTypes.string.isRequired,
  labelField: PropTypes.string.isRequired,
  valueField: PropTypes.string.isRequired,
};

export default connectField(CrossReferenceSelectField);

filterDOMProps.register(
  'query',
  'edges',
  'primaryKeyField',
  'labelField',
  'valueField',
  'multiple',
);
