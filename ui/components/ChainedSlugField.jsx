/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Input from 'antd/lib/input';
import BaseField from 'uniforms/BaseField';
import connectField from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';
import joinName from 'uniforms/joinName';
import wrapField from 'uniforms-antd/wrapField';
import slugify from 'slugify';

const ChainedSlugField = (props, { uniforms }) => {
  let currentValue = props.value || undefined;
  let sourceValue;

  const [prevSelfValue, setPrevSelfValue] = useState(currentValue);
  const [prevSourceValue, setPrevSourceValue] = useState(uniforms.model[props.sourceField]);
  // console.log(`init (${prevSelfValue}), (${prevSourceValue})`);

  if (uniforms.model[props.sourceField] && typeof uniforms.model[props.sourceField] === 'string') {
    if (prevSelfValue === prevSourceValue) {
      // console.log(`should update (${prevSelfValue}), (${prevSourceValue})`);
      // the fields were synced so we should continue to update it
      sourceValue = slugify(uniforms.model[props.sourceField], { lower: true });
      if (sourceValue !== prevSourceValue) {
        setPrevSourceValue(sourceValue);
        setPrevSelfValue(sourceValue);
      }
      currentValue = sourceValue;
    }
  }

  useEffect(() => {
    uniforms.onChange(props.name, prevSourceValue);
  }, [prevSourceValue]);

  //console.log(props, uniforms);

  // console.log('currentValue', currentValue);

  function handleChange(event) {
    setPrevSelfValue(event.target.value);
    return props.onChange(event.target.value);
  }

  return wrapField(
    props,
    <Input
      allowClear={props.allowClear}
      disabled={props.disabled}
      id={props.id}
      name={props.name}
      onChange={handleChange}
      placeholder={props.placeholder}
      ref={props.inputRef}
      type={props.type}
      value={currentValue}
      {...filterDOMProps(props)}
    />,
  );
};

ChainedSlugField.defaultProps = {
  label: '',
  // id: undefined,
  value: undefined,
  // edges: undefined,
  placeholder: null,
  disabled: false,
  sourceField: 'name',
  seperator: '-',
};

ChainedSlugField.propTypes = {
  // id: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  sourceField: PropTypes.string,
  seperator: PropTypes.string,
  // query: PropTypes.string.isRequired,
  // edges: PropTypes.string.isRequired,
  // labelField: PropTypes.string.isRequired,
  // valueField: PropTypes.string.isRequired,
};

ChainedSlugField.contextTypes = BaseField.contextTypes;

filterDOMProps.register('allowClear', 'sourceField', 'seperator');

const ConnectedField = connectField(ChainedSlugField);

export default class extends ConnectedField {
  constructor(props, context) {
    // console.log('constructor', props, context);
    super(props, context);

    this.name = joinName(context.name, props.name);

    const allProps = context.uniforms.schema.getProps(this.name, { ...props });
    if (allProps.sourceField) {
      this.name = allProps.sourceField;
    }
  }

  shouldComponentUpdate(props, state, context) {
    const prevContext = this.context.uniforms;
    const nextContext = context.uniforms;

    if (prevContext.model[this.name] !== nextContext.model[this.name]) {
      // console.log('shouldComponentUpdate', this, props, state, context);
      return true;
    }

    return super.shouldComponentUpdate(props, state, context);
  }
}
