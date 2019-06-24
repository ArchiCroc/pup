import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AutoForm from 'uniforms/AutoForm';
import AutoField from 'uniforms-antd/AutoField';
import i18n from 'meteor/universe:i18n';
import { compose, graphql, withApollo } from 'react-apollo';
import FileSaver from 'file-saver';
import base64ToBlob from 'b64-to-blob';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Tabs from 'antd/lib/tabs';
import Button from 'antd/lib/button';
import { capitalize } from 'lodash';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import message from 'antd/lib/message';
import AccountPageFooter from './components/AccountPageFooter';
import UserSettings from './components/UserSettings';
import { user as userQuery, exportUserData as exportUserDataQuery } from './queries/Users.gql';
import {
  updateUser as updateUserMutation,
  removeUser as removeUserMutation,
} from './mutations/Users.gql';
import ProfileSchema from '../../api/Users/schemas/profile';
import StyledProfile from './StyledProfile';

function Profile(props) {
  const [activeTab, setActiveTab] = useState('profile');

  const getUserType = (user) => (user.oAuthProvider ? 'oauth' : 'password');

  const handleExportData = async (event) => {
    event.preventDefault();
    const { data } = await props.client.query({
      query: exportUserDataQuery,
    });

    FileSaver.saveAs(base64ToBlob(data.exportUserData.zip), `${Meteor.userId()}.zip`);
  };

  const handleDeleteAccount = () => {
    if (confirm(i18n.__('Users.confirm_delete_account'))) {
      props.removeUser();
    }
  };

  const handleSubmit = (form) => {
    const cleanForm = ProfileSchema.clean(form);
    props.updateUser({
      variables: {
        user: {
          email: cleanForm.emailAddress,
          profile: {
            name: {
              first: cleanForm.firstName,
              last: cleanForm.lastName,
            },
          },
        },
      },
    });

    if (cleanForm.newPassword) {
      Accounts.changePassword(cleanForm.currentPassword, cleanForm.newPassword, (error) => {
        if (error) {
          message.danger(error.reason);
        } else {
          cleanForm.currentPassword = ''; // eslint-disable-line no-param-reassign
          cleanForm.newPassword = ''; // eslint-disable-line no-param-reassign
        }
      });
    }
  };

  const renderOAuthUser = (user) => (
    <div className="OAuthProfile">
      <div key={user.oAuthProvider} className={`LoggedInWith ${user.oAuthProvider}`}>
        <img src={`/${user.oAuthProvider}.svg`} alt={user.oAuthProvider} />
        <p>
          {i18n.__('Users.profile_oauth_user', {
            provider: capitalize(user.oAuthProvider),
            email: user.emailAddress,
          })}
        </p>
        <Button
          className={`btn btn-${user.oAuthProvider}`}
          href={
            {
              facebook: 'https://www.facebook.com/settings',
              google: 'https://myaccount.google.com/privacy#personalinfo',
              github: 'https://github.com/settings/profile',
            }[user.oAuthProvider]
          }
          target="_blank"
        >
          Edit Profile on {capitalize(user.oAuthProvider)}
          {i18n.__('Users.profile_oauth_edit_profile', {
            provider: capitalize(user.oAuthProvider),
          })}
        </Button>
      </div>
    </div>
  );

  const renderPasswordUser = (user) => (
    <div>
      <Row gutter={50}>
        <Col xs={12}>
          <AutoField name="firstName" placeholder={i18n.__('Users.first_name')} />
        </Col>
        <Col xs={12}>
          <AutoField name="lastName" placeholder={i18n.__('Users.last_name')} />
        </Col>
      </Row>

      <AutoField name="emailAddress" placeholder={i18n.__('Users.email_address')} />
      <AutoField
        name="currentPassword"
        ref={(currentPassword) => {
          this.currentPassword = currentPassword;
        }}
        placeholder={i18n.__('Users.current_password')}
      />
      <AutoField
        name="newPassword"
        ref={(newPassword) => {
          this.newPassword = newPassword;
        }}
        help="Use at least six characters."
        placeholder={i18n.__('Users.new_password')}
      />

      <Button htmlType="submit" type="primary">
        {i18n.__('Users.profile_submit')}
      </Button>
    </div>
  );

  const renderProfileForm = (user) =>
    user &&
    {
      password: renderPasswordUser,
      oauth: renderOAuthUser,
    }[getUserType(user)](user);

  const { data, updateUser } = props;

  // console.log(this.props);

  const model = data.user
    ? {
        firstName: data.user.name.first,
        lastName: data.user.name.last,
        emailAddress: data.user.emailAddress,
      }
    : {};

  return data.user ? (
    <StyledProfile>
      <h4 className="page-header">
        {data.user.name ? `${data.user.name.first} ${data.user.name.last}` : data.user.username}
      </h4>
      <Tabs
        // animation={false}
        activeKey={activeTab}
        onChange={setActiveTab}
        id="admin-user-tabs"
      >
        <Tabs.TabPane key="profile" tab={i18n.__('Users.profile')}>
          <Row>
            <Col xs={24} sm={12} md={8}>
              <AutoForm
                schema={ProfileSchema}
                model={model}
                onSubmit={handleSubmit}
                showInlineError
                placeholder
              >
                {renderProfileForm(data.user)}
              </AutoForm>

              <AccountPageFooter>
                <p>
                  <Button type="link" className="btn-export" onClick={handleExportData}>
                    {i18n.__('Users.export_user_data_button')}
                  </Button>
                  {i18n.__('Users.export_user_data_help')}
                </p>
              </AccountPageFooter>
              <AccountPageFooter>
                <Button type="danger" onClick={handleDeleteAccount}>
                  {i18n.__('Users.delete_my_account_button')}
                </Button>
              </AccountPageFooter>
            </Col>
          </Row>
        </Tabs.TabPane>
        <Tabs.TabPane key="settings" tab={i18n.__('Users.settings')}>
          <UserSettings settings={data.user.settings} updateUser={updateUser} />
        </Tabs.TabPane>
      </Tabs>
    </StyledProfile>
  ) : (
    <div />
  );
}

Profile.propTypes = {
  data: PropTypes.object.isRequired,
  updateUser: PropTypes.func.isRequired,
  removeUser: PropTypes.func.isRequired,
  client: PropTypes.object.isRequired,
};

export default compose(
  graphql(userQuery),
  graphql(updateUserMutation, {
    name: 'updateUser',
    options: () => ({
      refetchQueries: [{ query: userQuery }],
      onCompleted: () => {
        message.success(i18n.__('profile_save_success'));
      },
      onError: (error) => {
        message.danger(error.message);
      },
    }),
  }),
  graphql(removeUserMutation, {
    name: 'removeUser',
    options: () => ({
      onCompleted: () => {
        message.success(i18n.__('user_delete_success'));
      },
      onError: (error) => {
        message.danger(error.message);
      },
    }),
  }),
)(withApollo(Profile));
