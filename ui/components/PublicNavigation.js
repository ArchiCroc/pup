import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
// import { LinkContainer } from 'react-router-bootstrap';
import Menu from 'antd/lib/menu';
import { Link } from 'react-router-dom';

const PublicNavigation = ({ location = { pathname: '' } }) => (
  <Menu
    theme="dark"
    mode="horizontal"
    defaultSelectedKeys={[location.pathname]}
    style={{ float: 'right', lineHeight: '64px' }}
  >
    <Menu.Item key="/signup">
      {i18n.__('Users.sign_up')}
      <Link to="/signup" />
    </Menu.Item>
    <Menu.Item key="/login">
      {i18n.__('Users.log_in')}
      <Link to="/login" />
    </Menu.Item>
  </Menu>
);
// PublicNavigation.defaultProps = {
//   location: { pathname: '' },
// };

PublicNavigation.propTypes = {
  location: PropTypes.object.isRequired,
};
export default PublicNavigation;
