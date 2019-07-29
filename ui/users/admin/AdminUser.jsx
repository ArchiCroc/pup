import React from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { generatePath } from 'react-router';
import i18n from 'meteor/universe:i18n';
import Tabs from 'antd/lib/tabs';
import Breadcrumb from 'antd/lib/breadcrumb';
import { Link } from 'react-router-dom';
import message from 'antd/lib/message';
import AdminUserProfile from './components/AdminUserProfile';
import UserSettings from '../components/UserSettings';
import { user as userQuery, users as usersQuery } from '../queries/Users.gql';
import {
  updateUser as updateUserMutation,
  removeUser as removeUserMutation,
} from '../mutations/Users.gql';

import Styles from './StyledAdminUser';

function AdminUser({ match, history }) {
  const { loading, data } = useQuery(userQuery, {
    fetchPolicy: 'no-cache',
    variables: {
      _id: match.params._id,
    },
  });

  const [updateUser] = useMutation(updateUserMutation, {
    onCompleted: () => {
      message.success(i18n.__('Documents.admin_user_updated'));
    },
    refetchQueries: [{ query: userQuery, variables: { _id: match.params._id } }],
  });
  const [removeUser] = useMutation(removeUserMutation, {
    onCompleted: () => {
      message.success(i18n.__('Documents.admin_user_removed'));
      history.push('/admin/users');
    },
    refetchQueries: [{ query: usersQuery }],
  });

  function handleTabClick(key) {
    const path = generatePath(match.path, { _id: match.params._id, tab: key });

    history.push(path);
  }

  const name = data.user && data.user.name;
  const username = data.user && data.user.username;

  return data.user ? (
    <div className="AdminUser">
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/admin/users">Users</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{name ? `${name.first} ${name.last}` : username}</Breadcrumb.Item>
      </Breadcrumb>
      <Styles.AdminUserHeader className="page-header">
        {name ? `${name.first} ${name.last}` : username}
        {data.user.oAuthProvider && (
          <span className={`label label-${data.user.oAuthProvider}`}>
            {data.user.oAuthProvider}
          </span>
        )}
      </Styles.AdminUserHeader>
      {/* <Styles.AdminUserTabs
          animation={false}
          activeKey={this.state.activeTab}
          onSelect={(activeTab) => this.setState({ activeTab })}
          id="admin-user-tabs"
        > */}
      <Tabs activeKey={match.params.tab || 'profile'} onTabClick={handleTabClick}>
        <Tabs.TabPane key="profile" tab="Profile">
          <AdminUserProfile
            user={data.user}
            updateUser={(options, callback) => {
              // NOTE: Do this to allow us to perform work inside of AdminUserProfile
              // after a successful update. Not ideal, but hey, c'est la vie.
              updateUser(options);
              if (callback) callback();
            }}
            removeUser={removeUser}
          />
        </Tabs.TabPane>
        <Tabs.TabPane key="settings" tab="Settings">
          <UserSettings isAdmin userId={data.user._id} settings={data.user.settings} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  ) : (
    <div />
  );
}

AdminUser.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default AdminUser;
