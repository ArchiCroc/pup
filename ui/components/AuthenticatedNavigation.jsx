import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import { withRouter, Link } from 'react-router-dom';
// import { LinkContainer } from 'react-router-bootstrap';
import Menu from 'antd/lib/menu';
import { Roles } from 'meteor/alanning:roles';

const AuthenticatedNavigation = ({ name, history, userId, location = { pathname: '' } }) => (
  <React.Fragment>
    <Menu
      theme="dark"
      mode="horizontal"
      defaultSelectedKeys={[location.pathname]}
      style={{ float: 'left', lineHeight: '64px' }}
    >
      <Menu.Item key="/documents">
        {i18n.__('Documents.document_plural')}
        <Link to="/project-requests" />
      </Menu.Item>

      {Roles.userIsInRole(userId, 'admin') && (
        <Menu.SubMenu title={i18n.__('admin')}>
          <Menu.Item key="/admin/users">
            {i18n.__('Users.user_plural')}

            <Link to="/admin/users" />
          </Menu.Item>
          <Menu.Item key="/admin/users/settings">
            {i18n.__('Users.user_settings')}
            <Link to="/admin/users/settings" />
          </Menu.Item>
        </Menu.SubMenu>
      )}
    </Menu>

    <Menu
      theme="dark"
      mode="horizontal"
      defaultSelectedKeys={[location.pathname]}
      style={{ float: 'right', lineHeight: '64px' }}
    >
      <Menu.SubMenu title={name}>
        <Menu.Item key="/profile">
          {i18n.__('profile')}
          <Link to="/profile" />
        </Menu.Item>
        <Menu.Item key="/logout">
          {i18n.__('logout')}
          <Link to="/logout" />
        </Menu.Item>
      </Menu.SubMenu>
    </Menu>
  </React.Fragment>
);

AuthenticatedNavigation.propTypes = {
  name: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  location: PropTypes.object.isRequired,
};

export default withRouter(AuthenticatedNavigation);
