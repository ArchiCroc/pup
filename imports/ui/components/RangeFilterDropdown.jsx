import React, { useState } from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import Slider from 'antd/lib/slider';
//import Slider from './ExponentialSlider';
//import Slider from './LogarithmicSlider';
import FilterDropdownMenuWrapper from 'antd/lib/table/FilterDropdownMenuWrapper';
//import Menu from 'antd/lib/menu';

function RangeFilterDropdown(props) {
  const { setSelectedKeys, selectedKeys, confirm, clearFilters, min, max, step } = props;
  // console.log('RangeFilterDropdown', props, selectedKeys.length === 2 ? selectedKeys : [min, max]);
  // const marks = {
  //   0: String(min),
  //   100: String(max),
  // };

  // function setRange(range) {
  //   setSelectedKeys(range);
  //   confirm();
  // }

  // const [currentValue, setCurrentValue] = useState(
  //   selectedKeys.length === 2 ? selectedKeys : [min, max],
  // );

  return (
    <FilterDropdownMenuWrapper>
      {/* <Menu style={{ width: 200 }}>
        <Menu.Item> */}
      <div style={{ width: 200, padding: '10px 10px 20px 10px', position: 'relative' }}>
        {typeof min === 'number' && typeof max === 'number' && (
          <Slider
            range
            step={step}
            min={min}
            max={max}
            // marks={marks}
            defaultValue={selectedKeys.length === 2 ? selectedKeys : [min, max]}
            // onChange={onChange}
            onAfterChange={setSelectedKeys}
          />
        )}
        {/* </Menu.Item>
      </Menu> */}
      </div>
      {/* There is bug with the tick marks so just manually add them */}
      <div className="ant-slider-mark" style={{}}>
        <span className="ant-slider-mark-text" style={{ top: 28, left: 2 }}>
          {min}
        </span>
        <span className="ant-slider-mark-text" style={{ top: 28, right: 2 }}>
          {max}
        </span>
      </div>
      <div className="ant-table-filter-dropdown-btns">
        <a className="ant-table-filter-dropdown-link confirm" onClick={confirm}>
          {i18n.__('confirm')}
        </a>
        <a className="ant-table-filter-dropdown-link clear" onClick={clearFilters}>
          {i18n.__('reset')}
        </a>
      </div>
    </FilterDropdownMenuWrapper>
  );
}

RangeFilterDropdown.defaultProps = {
  step: 1,
  min: undefined,
  max: undefined,
};

RangeFilterDropdown.propTypes = {
  step: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
};

export default RangeFilterDropdown;
