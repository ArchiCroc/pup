import React, { useState } from 'react';
import { generatePath } from 'react-router';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';
import base64ToBlob from 'b64-to-blob';
import FileSaver from 'file-saver';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import i18n from 'meteor/universe:i18n';
import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Button from 'antd/lib/button';
import message from 'antd/lib/message';
import Modal from 'antd/lib/modal';
import Tabs from 'antd/lib/tabs';
import capitalize from 'lodash/capitalize';
import { TextField } from 'uniforms-antd';
import AutoForm from '/imports/ui/components/AutoForm';
import PageHeader from '/imports/ui/components/PageHeader';
import AccountPageFooter from './components/AccountPageFooter';
import UserSettings from './components/UserSettings';
import { USER_QUERY, EXPORT_USER_DATA_QUERY } from './graphql/queries.gql';
import {
  UPDATE_USER_MUTATION,
  REMOVE_USER_MUTATION,
} from './graphql/mutations.gql';
import ProfileSchema from '/imports/common/Users/schemas/profile';
import { User } from '/imports/common/Users/interfaces';
import StyledProfilePage from './StyledProfilePage';

function ProfilePage() {
  const history = useHistory();
  const match = useRouteMatch();
  const { _id, tab } = useParams<{ _id: string, tab: string }>();

  const client = useApolloClient();

  const { loading, data: { user } = {} } = useQuery(USER_QUERY, {
    fetchPolicy: 'no-cache',
    variables: {
      _id,
    },
  });

  const [updateUser] = useMutation(UPDATE_USER_MUTATION, {
    onCompleted: () => {
      message.success(i18n.__('Users.profile_save_success'));
    },
    onError: (error) => {
      message.error(error.message);
    },
    refetchQueries: [{ query: USER_QUERY, variables: { _id } }],
  });
  const [removeUser] = useMutation(REMOVE_USER_MUTATION, {
    onCompleted: () => {
      message.success(i18n.__('Users.user_delete_success'));
      history.push('/');
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const getUserType = (u: User) => (u.oAuthProvider ? 'oauth' : 'password');

  function handleExportData(event: MouseEvent) {
    event.preventDefault();
    fetchExportData(); //strip the async off to make the event handler happy
  }

  async function fetchExportData() {
    const { data: result } = await client.query({
      query: EXPORT_USER_DATA_QUERY,
    });

    FileSaver.saveAs(base64ToBlob(result.exportUserData.zip), `${Meteor.userId()}.zip`);
  }

  function handleDeleteAccount() {
    // @todo make this an antd confirm box

    Modal.confirm({
      title: i18n.__('Users.confirm_delete_account_title'),
      content: i18n.__('Users.confirm_delete_account_content'),
      okText: i18n.__('Users.delete_my_account'),
      okType: 'danger',
      cancelText: i18n.__('Users.cancel'),
      onOk() {
        removeUser();
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  function handleSubmit(model: object) {
    const cleanForm = ProfileSchema.clean(model);
    updateUser({
      variables: {
        user: {
          email: cleanForm.emailAddress,
          profile: {
            firstName: cleanForm.firstName,
            lastName: cleanForm.lastName,
          },
        },
      },
    });

    if (cleanForm.newPassword) {
      Accounts.changePassword(cleanForm.currentPassword, cleanForm.newPassword, (error) => {
        if (error) {
          message.error(error.reason);
        } else {
          cleanForm.currentPassword = ''; // eslint-disable-line no-param-reassign
          cleanForm.newPassword = ''; // eslint-disable-line no-param-reassign
        }
      });
    }
  }

  function handleTabClick(key: string) {
    const path = generatePath(match.path, { _id, tab: key });
    history.push(path);
  }

  const renderOAuthUser = (u: User) => (
    <div className="OAuthProfile">
      <div key={u.oAuthProvider} className={`LoggedInWith ${u.oAuthProvider}`}>
        <img src={`/${u.oAuthProvider}.svg`} alt={u.oAuthProvider} />
        <p>
          {i18n.__('Users.profile_oauth_user', {
            provider: capitalize(u.oAuthProvider),
            email: u.emailAddress,
          })}
        </p>
        <Button
          className={`btn btn-${u.oAuthProvider}`}
          href={
            {
              facebook: 'https://www.facebook.com/settings',
              google: 'https://myaccount.google.com/privacy#personalinfo',
              github: 'https://github.com/settings/profile',
            }[u.oAuthProvider]
          }
          target="_blank"
        >
          {i18n.__('Users.edit_profile_on_o_auth_provider', {
            oAuthProvider: capitalize(u.oAuthProvider),
          })}
        </Button>
      </div>
    </div>
  );

  const renderPasswordUser = () => (
    <div>
      <Row gutter={50}>
        <Col xs={12}>
          <TextField name="firstName" />
        </Col>
        <Col xs={12}>
          <TextField name="lastName" />
        </Col>
      </Row>

      <TextField name="emailAddress" />
      <TextField
        name="currentPassword"
      // ref={(currentPassword) => {
      //   this.currentPassword = currentPassword;
      // }}
      />
      <TextField
        name="newPassword"
      // ref={(newPassword) => {
      //   this.newPassword = newPassword;
      // }}

      />

      <Button htmlType="submit" type="primary">
        {i18n.__('Users.profile_submit')}
      </Button>
    </div>
  );

  const renderProfileForm = (u: User) =>
    u &&
    {
      password: renderPasswordUser,
      oauth: renderOAuthUser,
    }[getUserType(u)](u);

  // convert graphql into flat data for form
  const model = user
    ? {
      firstName: user.profile.firstName,
      lastName: user.profile.lastName,
      emailAddress: user.emailAddress,
    }
    : {};

  return user ? (
    <StyledProfilePage md={16} lg={12} xl={10} xxl={8}>
      <PageHeader title={user.fullName || user.username || 'unknown'} className="no-border" />
      <Tabs
        // animation={false}
        // activeKey={activeTab}
        // onChange={setActiveTab}
        activeKey={tab || 'profile'}
        onTabClick={handleTabClick}
      >
        <Tabs.TabPane key="profile" tab={i18n.__('Users.profile')}>
          <AutoForm
            name="user-profile"
            schema={ProfileSchema}
            model={model}
            onSubmit={handleSubmit}
          >
            {renderProfileForm(user)}
          </AutoForm>

          <AccountPageFooter>
            <p>
              <Button type="link" className="btn-export" onClick={handleExportData as any}>
                {i18n.__('Users.export_user_data_button')}
              </Button>
              {i18n.__('Users.export_user_data_help')}
            </p>
          </AccountPageFooter>
          <AccountPageFooter>
            <Button danger onClick={handleDeleteAccount}>
              {i18n.__('Users.delete_my_account_button')}
            </Button>
          </AccountPageFooter>
        </Tabs.TabPane>
        <Tabs.TabPane key="settings" tab={i18n.__('Users.settings')}>
          <UserSettings user={user} />
        </Tabs.TabPane>
      </Tabs>
    </StyledProfilePage>
  ) : (
    <div />
  );
}

export default ProfilePage;
