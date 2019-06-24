import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';

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

function AdminUser(props) {
  const { data, updateUser, removeUser } = props;
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
      <Tabs>
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
          <UserSettings
            isAdmin
            userId={data.user._id}
            settings={data.user.settings}
            updateUser={updateUser}
          />
        </Tabs.TabPane>
      </Tabs>
    </div>
  ) : (
    <div />
  );
}

AdminUser.propTypes = {
  data: PropTypes.object.isRequired,
  updateUser: PropTypes.func.isRequired,
  removeUser: PropTypes.func.isRequired,
};

export default compose(
  graphql(userQuery, {
    options: ({ match }) => ({
      // NOTE: This ensures cache isn't too aggressive when moving between users.
      // Forces Apollo to perform userQuery as a user is loaded instead of falling
      // back to the cache. Users share similar data which gets cached and ends up
      // breaking the UI.
      fetchPolicy: 'no-cache',
      variables: {
        _id: match.params._id,
      },
    }),
  }),
  graphql(updateUserMutation, {
    name: 'updateUser',
    options: ({ match }) => ({
      refetchQueries: [{ query: userQuery, variables: { _id: match.params._id } }],
      onCompleted: () => {
        message.success('User updated!');
      },
    }),
  }),
  graphql(removeUserMutation, {
    name: 'removeUser',
    options: ({ history }) => ({
      refetchQueries: [{ query: usersQuery }],
      onCompleted: () => {
        message.success('User deleted!');
        history.push('/admin/users');
      },
    }),
  }),
)(AdminUser);
