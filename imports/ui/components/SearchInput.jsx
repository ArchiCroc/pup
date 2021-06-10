import React from 'react';
import PropTypes from 'prop-types';
import Input from 'antd/lib/input';

const { Search } = Input;

const SearchInput = ({ className, style, onSearch, placeholder, defaultValue }) => (
  <span className={className} style={style} role="search">
    <Search
      placeholder={placeholder}
      onSearch={onSearch}
      defaultValue={defaultValue}
      allowClear
      enterButton
    />
  </span>
);

SearchInput.defaultProps = {
  className: undefined,
  style: undefined,
  placeholder: 'Search...',
  defaultValue: undefined,
};

SearchInput.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  placeholder: PropTypes.string,
  defaultValue: PropTypes.string,
  onSearch: PropTypes.func.isRequired,
};

export default SearchInput;
