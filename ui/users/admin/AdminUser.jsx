import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { generatePath } from 'react-router';
// import i18n from 'meteor/universe:i18n';
import Tabs from 'antd/lib/tabs';
import Breadcrumb from 'antd/lib/breadcrumb';
import { Link } from 'react-router-dom';
import AdminUserProfile from './components/AdminUserProfile';
import UserSettings from '../components/UserSettings';
import { user as userQuery } from '../queries/Users.gql';
import Loading from '../../components/Loading';
import NotFound from '../../pages/NotFound';

import Styles from './StyledAdminUser';

function AdminUser({ match, history }) {
  const { loading, data: { user } = {} } = useQuery(userQuery, {
    fetchPolicy: 'no-cache',
    variables: {
      _id: match.params._id,
    },
  });

  function handleTabClick(key) {
    const path = generatePath(match.path, { _id: match.params._id, tab: key });
    history.push(path);
  }

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <NotFound />;
  }

  const { profile: { firstName, lastName } = {}, username } = user;

  return (
    <div className="AdminUser">
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/admin/users">Users</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{name ? `${firstName} ${lastName}` : username}</Breadcrumb.Item>
      </Breadcrumb>
      <Styles.AdminUserHeader className="page-header">
        {name ? `${firstName} ${lastName}` : username}
        {user.oAuthProvider && (
          <span className={`label label-${user.oAuthProvider}`}>{user.oAuthProvider}</span>
        )}
      </Styles.AdminUserHeader>
      <Tabs activeKey={match.params.tab || 'profile'} onTabClick={handleTabClick}>
        <Tabs.TabPane key="profile" tab="Profile">
          <AdminUserProfile user={user} />
        </Tabs.TabPane>
        <Tabs.TabPane key="settings" tab="Settings">
          <UserSettings isAdmin user={user} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

AdminUser.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default AdminUser;