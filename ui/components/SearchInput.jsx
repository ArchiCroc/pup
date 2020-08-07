import React from 'react';
import PropTypes from 'prop-types';
import SearchIcon from '@ant-design/icons/SearchOutlined';
import StyledSearchInput from './StyledSearchInput';

const SearchInput = ({ placeholder, value, onChange }) => (
  <StyledSearchInput className="SearchInput">
    <SearchIcon />
    <input
      type="text"
      name="search"
      className="form-control"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </StyledSearchInput>
);

SearchInput.defaultProps = {
  placeholder: 'Search...',
  value: '',
};

SearchInput.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default SearchInput;
