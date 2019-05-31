import React from 'react';
import PropTypes from 'prop-types';
import AntdDropdown from 'antd/lib/dropdown';
import Button from 'antd/lib/button';
import Icon from 'antd/lib/icon';

const Dropdown = (props) => (
  <AntdDropdown overlay={props.children}>
    <Button>
      {props.title} <Icon type="down" />
    </Button>
  </AntdDropdown>
);

Dropdown.propTypes = {
  title: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
};

export default Dropdown;
