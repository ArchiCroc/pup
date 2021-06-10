import React, { useState } from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import Slider from 'antd/lib/slider';
import FilterDropdownMenuWrapper from 'antd/lib/table/FilterDropdownMenuWrapper';
//import Menu from 'antd/lib/menu';

function LogarithmicSlider(props) {
  const { defaultValue, onAfterChange, min, max, step, value: currentValue, marks, range } = props;
  // console.log('LogarithmicSlider', props, selectedKeys.length === 2 ? selectedKeys : [min, max]);

  // const marks = {
  //   0: String(min),
  //   100: String(max),
  // };

  // function setRange(range) {
  //   setSelectedKeys(range);
  //   confirm();
  // }

  const sliderMinValue = 0;
  const sliderMaxValue = 100;

  const offset = 5;

  const minLogValue = Math.log(offset);
  const maxLogValue = Math.log(max - min + offset);

  const scale = (maxLogValue - minLogValue) / (sliderMaxValue - sliderMinValue);

  // Calculate value from a slider position
  function getValue(position) {
    return max - Math.round(Math.exp((position - sliderMinValue) * scale + minLogValue) - offset); // - offset;
  }
  // Calculate slider position from a value
  function getPosition(value) {
    return sliderMinValue + (Math.log(value - min + offset) - minLogValue) / scale;
  }

  function handleChange(value) {
    console.log('handleChange', value, range ? value.map(getValue).reverse() : getValue(value));
  }
  function handleAfterChange(value) {
    console.log(
      'handleAfterChange',
      value,
      range ? value.map(getValue).reverse() : getValue(value),
    );
  }

  console.log(
    'default value',
    range,
    defaultValue,
    defaultValue && range ? defaultValue.map(getPosition) : getPosition(defaultValue),
    minLogValue,
    maxLogValue,
  );

  return (
    <Slider
      range={range}
      step={1}
      min={sliderMinValue}
      max={sliderMaxValue}
      marks={marks}
      defaultValue={
        defaultValue && range ? defaultValue.map(getPosition) : getPosition(defaultValue)
      }
      tipFormatter={getValue}
      onChange={handleChange}
      onAfterChange={handleAfterChange}
      reverse
    />
  );
}

LogarithmicSlider.defaultProps = {
  step: 1,
  min: undefined,
  max: undefined,
};

LogarithmicSlider.propTypes = Slider.propTypes;

export default LogarithmicSlider;
