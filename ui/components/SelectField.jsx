import React from 'react';
import SelectAntD from 'antd/lib/select';
import connectField from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';
import wrapField from 'uniforms-antd/wrapField';

const Select = (props) =>
  wrapField(
    props,
    <SelectAntD
      allowClear={!props.required}
      disabled={props.disabled}
      id={props.id}
      mode={props.fieldType === Array ? 'multiple' : undefined}
      name={props.name}
      onChange={(value) => props.onChange(value)}
      placeholder={props.placeholder}
      ref={props.inputRef}
      value={props.value}
      {...filterDOMProps(props)}
    >
      {props.options.map(({ label, value }) => (
        <SelectAntD.Option key={value} value={value}>
          {label}
        </SelectAntD.Option>
      ))}
    </SelectAntD>,
  );

export default connectField(Select);
