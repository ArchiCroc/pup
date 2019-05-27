import react from 'react';
import PropTypes from 'prop-types';
import AntdAlert from 'antd/lib/alert';

const Alert = ({ children, ...props }) => <AntdAlert {...props} message={children} />;

Alert.PropTypes = {
  children: PropTypes.node,
};

export default Alert;
