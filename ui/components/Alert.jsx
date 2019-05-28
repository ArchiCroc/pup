import React from 'react';
import PropTypes from 'prop-types';
import AntdAlert from 'antd/lib/alert';

const Alert = ({ children, ...props }) => <AntdAlert {...props} message={children} />;

Alert.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Alert;
