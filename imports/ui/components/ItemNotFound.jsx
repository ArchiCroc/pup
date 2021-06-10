import React from 'react';
import PropTypes from 'prop-types';
import Alert from 'antd/lib/alert';

const ItemNotFound = ({ title, message }) => (
  <Alert type="danger" message={title} description={message} />
);

ItemNotFound.defaultProps = {
  message: 'unknown',
};

ItemNotFound.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string,
};

export default ItemNotFound;
