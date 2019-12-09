import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { generatePath } from 'react-router';
import i18n from 'meteor/universe:i18n';
import Tabs from 'antd/lib/tabs';
import PageBreadcrumbs, { Breadcrumb } from '../../components/PageBreadcrumbs';
import PageHeader from '../../components/PageHeader';
import AdminUserProfile from './components/AdminUserProfile';
import UserSettings from '../components/UserSettings';
import { user as userQuery } from '../queries/Users.gql';
import Loading from '../../components/Loading';
import NotFound from '../../pages/NotFound';

import StyledAdminUser from './StyledAdminUser';

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

  const { fullName, profile: { firstName, lastName } = {}, username = 'unknown' } = user;

  console.log(user);

  return (
    <StyledAdminUser>
      <PageBreadcrumbs>
        <Breadcrumb to="/admin/users">{i18n.__('Users.user_plural')}</Breadcrumb>
        <Breadcrumb>{fullName || username || 'unknown'}</Breadcrumb>
      </PageBreadcrumbs>
      <PageHeader title={fullName || username || 'unknown'} className="no-border">
        {user.oAuthProvider && (
          <span className={`label label-${user.oAuthProvider}`}>{user.oAuthProvider}</span>
        )}
      </PageHeader>
      <Tabs activeKey={match.params.tab || 'profile'} onTabClick={handleTabClick}>
        <Tabs.TabPane key="profile" tab="Profile">
          <AdminUserProfile user={user} />
        </Tabs.TabPane>
        <Tabs.TabPane key="settings" tab="Settings">
          <UserSettings isAdmin user={user} />
        </Tabs.TabPane>
      </Tabs>
    </StyledAdminUser>
  );
}

AdminUser.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default AdminUser;
