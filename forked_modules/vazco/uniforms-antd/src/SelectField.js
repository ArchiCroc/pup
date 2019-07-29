import Checkbox from 'antd/lib/checkbox';
import Radio from 'antd/lib/radio';
import React from 'react';
import SelectAntD from 'antd/lib/select';
import connectField from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';

import wrapField from './wrapField';

const renderCheckboxes = props =>
  React.createElement((props.fieldType === Array ? Checkbox : Radio).Group, {
    disabled: props.disabled,
    id: props.id,
    name: props.name,
    onChange:
      props.fieldType === Array
        ? value => props.onChange(value)
        : event => props.onChange(event.target.value),
    options: props.allowedValues.map(value => ({
      label: props.transform ? props.transform(value) : value,
      value
    })),
    value: props.value,
    ...filterDOMProps(props)
  });

const renderSelect = props => (
  <SelectAntD
    allowClear={!props.required}
    disabled={props.disabled}
    id={props.id}
    mode={props.fieldType === Array ? 'multiple' : undefined}
    name={props.name}
    onChange={value => props.onChange(value)}
    placeholder={props.placeholder}
    ref={props.inputRef}
    value={
      props.fieldType === Array ? props.value || [] : '' + (props.value || '')
    }
    {...filterDOMProps(props)}
  >
    {props.allowedValues.map(value => (
      <SelectAntD.Option key={value} value={value}>
        {props.transform ? props.transform(value) : value}
      </SelectAntD.Option>
    ))}
  </SelectAntD>
);

const Select = ({ checkboxes, ...props }) =>
  wrapField(props, checkboxes ? renderCheckboxes(props) : renderSelect(props));
export default connectField(Select);
