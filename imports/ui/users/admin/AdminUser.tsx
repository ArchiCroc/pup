import React from 'react';
import { generatePath } from 'react-router';
import { useHistory, useLocation, useParams, useRouteMatch } from 'react-router-dom';
import i18n from 'meteor/universe:i18n';
import { useQuery } from '@apollo/client';
import Tabs from 'antd/lib/tabs';
import PageBreadcrumbs, { Breadcrumb } from '/imports/ui/components/PageBreadcrumbs';
import PageHeader from '/imports/ui/components/PageHeader';
import AdminUserProfile from './components/AdminUserProfile';
import UserSettings from '/imports/ui/users/components/UserSettings';
import Loading from '/imports/ui/components/Loading';
import NotFound from '../../pages/NotFoundPage';

import StyledAdminUser from './StyledAdminUser';

interface AdminUserParams {
  _id: string;
  tab?: string;
}

import { USER_QUERY } from '../graphql/queries.gql';
import { User } from '/imports/common/Users/interfaces';
function AdminUser() {
  const history = useHistory();
  const location = useLocation();
  const match = useRouteMatch();
  const { _id, tab = 'profile' } = useParams<AdminUserParams>();
  const { loading, data: { user } = {} } = useQuery<{ user: User }>(USER_QUERY, {
    fetchPolicy: 'no-cache',
    variables: {
      _id,
    },
  });

  function handleTabClick(key: string) {
    const path = generatePath(match.path, { _id, tab: key });
    history.push(path);
  }

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <NotFound />;
  }

  const { fullName, /*profile: { firstName, lastName } = {},*/ username = 'unknown' } = user;

  console.log(location);

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
      <Tabs activeKey={tab} onTabClick={handleTabClick}>
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

export default AdminUser;
