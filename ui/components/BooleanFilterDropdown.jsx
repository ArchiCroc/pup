import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import Radio from 'antd/lib/radio';
import isArray from 'lodash/isArray';
import FilterDropdownMenuWrapper from 'antd/lib/table/FilterDropdownMenuWrapper';
//import Menu from 'antd/lib/menu';

function BooleanFilterDropdown(props) {
  const { setSelectedKeys, selectedKeys, confirm, clearFilters, trueText, falseText } = props;

  const initialValue =
    isArray(selectedKeys) && selectedKeys.length > 0 ? selectedKeys[0] : undefined;

  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
  };

  function handleChange(e) {
    setSelectedKeys([e.target.value]);
  }

  return (
    <FilterDropdownMenuWrapper>
      {/* <Menu style={{ width: 200 }}>
        <Menu.Item> */}
      <div style={{ width: 200, padding: '10px 10px 20px 10px', position: 'relative' }}>
        {/* <Slider
          range
          step={step}
          min={min}
          max={max}
          // marks={marks}
          defaultValue={selectedKeys.length === 2 ? selectedKeys : [min, max]}
          // onChange={onChange}
          onAfterChange={setSelectedKeys}
        /> */}
        <Radio.Group onChange={handleChange} defaultValue={initialValue}>
          <Radio style={radioStyle} value={true}>
            {i18n.__(trueText)}
          </Radio>
          <Radio style={radioStyle} value={false}>
            {i18n.__(falseText)}
          </Radio>
        </Radio.Group>

        {/* </Menu.Item>
      </Menu> */}
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

BooleanFilterDropdown.defaultProps = {
  trueText: 'true',
  falseText: 'false',
};

BooleanFilterDropdown.propTypes = {
  trueText: PropTypes.string,
  falseText: PropTypes.string,
};

export default BooleanFilterDropdown;
