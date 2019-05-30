import React from 'react';
import PropTypes from 'prop-types';
import AutoForm from 'uniforms/AutoForm';
import AutoField from 'uniforms-antd/AutoField';
import i18n from 'meteor/universe:i18n';
import { compose, graphql, withApollo } from 'react-apollo';
import FileSaver from 'file-saver';
import base64ToBlob from 'b64-to-blob';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
// import Alert from 'antd/lib/alert';
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

class Profile extends React.Component {
  state = { activeTab: 'profile' };

  getUserType = (user) => (user.oAuthProvider ? 'oauth' : 'password');

  handleExportData = async (event) => {
    event.preventDefault();
    const { data } = await this.props.client.query({
      query: exportUserDataQuery,
    });

    FileSaver.saveAs(base64ToBlob(data.exportUserData.zip), `${Meteor.userId()}.zip`);
  };

  handleDeleteAccount = () => {
    if (confirm(i18n.__('Users.confirm_delete_account'))) {
      this.props.removeUser();
    }
  };

  handleSubmit = (form) => {
    const cleanForm = ProfileSchema.clean(form);
    this.props.updateUser({
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

  renderOAuthUser = (user) => (
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

  renderPasswordUser = (user) => (
    <div>
      <Row>
        <Col xs={6}>
          <AutoField name="firstName" placeholder={i18n.__('Users.first_name')} />
        </Col>
        <Col xs={6}>
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

      <Button type="submit" type="primary">
        {i18n.__('Users.profile_submit')}
      </Button>
    </div>
  );

  renderProfileForm = (user) =>
    user &&
    {
      password: this.renderPasswordUser,
      oauth: this.renderOAuthUser,
    }[this.getUserType(user)](user);

  render() {
    const { data, updateUser } = this.props;

    console.log(this.props);

    const model = data.user
      ? {
          firstName: data.user.name.first,
          lastName: data.user.name.last,
          emailAddress: data.user.emailAddress,
        }
      : {};

    return data.user ? (
      <Styles.Profile>
        <h4 className="page-header">
          {data.user.name ? `${data.user.name.first} ${data.user.name.last}` : data.user.username}
        </h4>
        <Tabs
          animation={false}
          activeKey={this.state.activeTab}
          onSelect={(activeTab) => this.setState({ activeTab })}
          id="admin-user-tabs"
        >
          <Tab eventKey="profile" title={i18n.__('Users.profile')}>
            <Row>
              <Col xs={12} sm={6} md={4}>
                <AutoForm
                  schema={ProfileSchema}
                  model={model}
                  onSubmit={this.handleSubmit}
                  showInlineError
                  placeholder
                >
                  {this.renderProfileForm(data.user)}
                </AutoForm>

                <AccountPageFooter>
                  <p>
                    <Button type="link" className="btn-export" onClick={this.handleExportData}>
                      {i18n.__('Users.export_user_data_button')}
                    </Button>
                    {i18n.__('Users.export_user_data_help')}
                  </p>
                </AccountPageFooter>
                <AccountPageFooter>
                  <Button type="danger" onClick={this.handleDeleteAccount}>
                    {i18n.__('Users.delete_my_account_button')}
                  </Button>
                </AccountPageFooter>
              </Col>
            </Row>
          </Tab>
          <Tab eventKey="settings" title={i18n.__('Users.settings')}>
            <UserSettings settings={data.user.settings} updateUser={updateUser} />
          </Tab>
        </Tabs>
      </Styles.Profile>
    ) : (
      <div />
    );
  }
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
