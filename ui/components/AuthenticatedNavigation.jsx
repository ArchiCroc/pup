import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import { Link, useLocation } from 'react-router-dom';
// import { LinkContainer } from 'react-router-bootstrap';
import Menu from 'antd/lib/menu';
import hasRole from '../../libs/hasRole';

// @todo get name/location from hook

function AuthenticatedNavigation({ name, roles }) {
  const { pathname = '' } = useLocation();

  return (
    <>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={[pathname]}
        style={{ float: 'left', lineHeight: '64px' }}
      >
        {/* #### PLOP_USER_MENU_ITEMS_START #### */}
        {/* #### ERROR_REPORTS_USER_MENU_ITEMS_START #### */}
        {/* #### ERROR_REPORTS_USER_MENU_ITEMS_END #### */}
        {/* #### USERS_ROLES_USER_MENU_ITEMS_START #### */}
        {/* #### USERS_ROLES_USER_MENU_ITEMS_END #### */}
        {/* #### PAGES_USER_MENU_ITEMS_START #### */}
        {/* #### PAGES_USER_MENU_ITEMS_END #### */}
        {/* #### USERS_USER_MENU_ITEMS_START #### */}
        {/* #### USERS_USER_MENU_ITEMS_END #### */}
        {/* #### PLOP_USER_MENU_ITEMS_END #### */}
        {hasRole(roles, 'admin') && (
          <Menu.SubMenu title={i18n.__('admin')} data-testid="nav-submenu-admin">
            {/* #### PLOP_ADMIN_MENU_ITEMS_START #### */}
            {/* #### ERROR_REPORTS_ADMIN_MENU_ITEMS_START #### */}
            <Menu.Item key="/admin/error-reports">
              {i18n.__('ErrorReports.error_report_plural')}
              <Link to="/admin/error-reports" />
            </Menu.Item>
            {/* #### ERROR_REPORTS_ADMIN_MENU_ITEMS_END #### */}
            {/* #### USERS_ROLES_ADMIN_MENU_ITEMS_START #### */}
            <Menu.Item key="/admin/users/roles">
              {i18n.__('UsersRoles.role_plural')}
              <Link to="/admin/users/roles" />
            </Menu.Item>
            {/* #### USERS_ROLES_ADMIN_MENU_ITEMS_END #### */}
            {/* #### PAGES_ADMIN_MENU_ITEMS_START #### */}
            {/* #### PAGES_ADMIN_MENU_ITEMS_END #### */}
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
        defaultSelectedKeys={[pathname]}
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
}
AuthenticatedNavigation.propTypes = {
  name: PropTypes.string.isRequired,
  // userId: PropTypes.string.isRequired,
  // location: PropTypes.object.isRequired,
  roles: PropTypes.array.isRequired,
};
export default AuthenticatedNavigation;
