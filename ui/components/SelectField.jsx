import React from 'react';
import PropTypes from 'prop-types';
import Select from 'antd/lib/select';
import connectField from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';
import wrapField from 'uniforms-antd/wrapField';
import i18n from 'meteor/universe:i18n';

const SelectField = (props) => {
  let { options } = props;
  if (props.allowedValues && !options) {
    if (props.transform) {
      options = props.allowedValues.map((item) => ({
        value: item,
        label: props.transform(item),
      }));
    } else {
      options = props.allowedValues.map((item) => ({
        value: item,
        label: i18n.__(props.i18nNamespace, item, {}),
      }));
    }
  }

  return wrapField(
    props,
    <Select
      {...filterDOMProps(props)}
      allowClear={!props.required}
      disabled={props.disabled}
      id={props.id}
      mode={props.fieldType === Array ? 'multiple' : undefined}
      name={props.name}
      onChange={(value) => props.onChange(value)}
      placeholder={props.placeholder instanceof Function ? props.placeholder() : props.placeholder}
      ref={props.inputRef}
      value={props.value !== null && props.value !== '' ? props.value : undefined}
    >
      {options.map(({ label, value }) => (
        <Select.Option key={value} value={value}>
          {label}
        </Select.Option>
      ))}
    </Select>,
  );
};

SelectField.propTypes = {
  i18nNamespace: PropTypes.string,
};

SelectField.defaultValues = {
  i18nNamespace: null,
};

export default connectField(SelectField);
