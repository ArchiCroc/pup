import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import { withRouter, Link } from 'react-router-dom';
// import { LinkContainer } from 'react-router-bootstrap';
import Menu from 'antd/lib/menu';
import hasRole from '../../libs/hasRole';

const AuthenticatedNavigation = ({ name, history, roles, location = { pathname: '' } }) => (
  <>
    <Menu
      theme="dark"
      mode="horizontal"
      defaultSelectedKeys={[location.pathname]}
      style={{ float: 'left', lineHeight: '64px' }}
    >
      {/* #### PLOP_USER_MENU_ITEMS_START #### */}
      {/* #### ROLES_USER_MENU_ITEMS_START #### */}
      {/* #### ROLES_USER_MENU_ITEMS_END #### */}
      {/* #### ERROR_REPORTS_USER_MENU_ITEMS_START #### */}
      {/* #### ERROR_REPORTS_USER_MENU_ITEMS_END #### */}
      {/* #### PAGES_USER_MENU_ITEMS_START #### */}
      {/* #### PAGES_USER_MENU_ITEMS_END #### */}
      {/* #### USERS_USER_MENU_ITEMS_START #### */}
      {/* #### USERS_USER_MENU_ITEMS_END #### */}
      {/* #### PLOP_USER_MENU_ITEMS_END #### */}
      {hasRole(roles, 'admin') && (
        <Menu.SubMenu title={i18n.__('admin')}>
          {/* #### PLOP_ADMIN_MENU_ITEMS_START #### */}
          {/* #### ROLES_ADMIN_MENU_ITEMS_START #### */}
          <Menu.Item key="/roles">
            {i18n.__('Roles.role_plural')}
            <Link to="/admin/users/roles" />
          </Menu.Item>
          {/* #### ROLES_ADMIN_MENU_ITEMS_END #### */}
          {/* #### PAGES_ADMIN_MENU_ITEMS_START #### */}
          {/* #### PAGES_ADMIN_MENU_ITEMS_END #### */}
          {/* #### ERROR_REPORTS_ADMIN_MENU_ITEMS_START #### */}
          <Menu.Item key="/error-reports">
            {i18n.__('ErrorReports.error_report_plural')} <Link to="/error-reports" />
          </Menu.Item>
          {/* #### ERROR_REPORTS_ADMIN_MENU_ITEMS_END #### */}
          {/* #### USERS_ADMIN_MENU_ITEMS_START #### */}
          <Menu.Item key="/admin/users">
            {i18n.__('Users.user_plural')} <Link to="/admin/users" />
          </Menu.Item>
          {/* #### USERS_ADMIN_MENU_ITEMS_END #### */}
          {/* #### PLOP_ADMIN_MENU_ITEMS_END #### */}
        </Menu.SubMenu>
      )}
    </Menu>
    <Menu
      theme="dark"
      mode="horizontal"
      defaultSelectedKeys={[location.pathname]}
      style={{ float: 'right', lineHeight: '64px' }}
      data-test="user-nav-dropdown"
    >
      <Menu.SubMenu title={name}>
        <Menu.Item key="/user/profile">
          {i18n.__('Users.profile')} <Link to="/user/profile" />
        </Menu.Item>
        <Menu.Item key="/logout">
          {i18n.__('Users.logout')} <Link to="/logout" />
        </Menu.Item>
      </Menu.SubMenu>
    </Menu>
  </>
);
AuthenticatedNavigation.propTypes = {
  name: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  location: PropTypes.object.isRequired,
  roles: PropTypes.array.isRequired,
};
export default withRouter(AuthenticatedNavigation);
