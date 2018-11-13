import React from 'react';
import PropTypes from 'prop-types';
import AutoForm from 'uniforms/AutoForm';
import AutoField from 'uniforms-bootstrap3/AutoField';
import i18n from 'meteor/universe:i18n';
import { compose, graphql, withApollo } from 'react-apollo';
import FileSaver from 'file-saver';
import base64ToBlob from 'b64-to-blob';
import { Row, Col, Button, Tabs, Tab } from 'react-bootstrap';
import { capitalize } from 'lodash';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Bert } from 'meteor/themeteorchef:bert';
<<<<<<< HEAD:ui/users/Profile.js
import Validation from '../components/Validation';
import InputHint from '../components/InputHint';
import AccountPageFooter from './components/AccountPageFooter';
import UserSettings from './components/UserSettings';
import { user as userQuery, exportUserData as exportUserDataQuery } from './queries/Users.gql';
import {
  updateUser as updateUserMutation,
  removeUser as removeUserMutation,
} from './mutations/Users.gql';
import Styles from './StyledProfile';
=======
import AccountPageFooter from '../../components/AccountPageFooter';
import UserSettings from '../../components/UserSettings';
import { user as userQuery, exportUserData as exportUserDataQuery } from '../../queries/Users.gql';
import {
  updateUser as updateUserMutation,
  removeUser as removeUserMutation,
} from '../../mutations/Users.gql';
import ProfileSchema from '../../../api/Users/schemas/profile';
import Styles from './styles';
>>>>>>> 84cb030a2463a3467bc126ac721ba4082b2dad1a:ui/pages/Profile/index.js

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
    if (confirm('Are you sure? This will permanently delete your account and all of its data.')) {
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
          Bert.alert(error.reason, 'danger');
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
          {`You're logged in with ${capitalize(user.oAuthProvider)} using the email address ${
            user.emailAddress
          }.`}
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
        </Button>
      </div>
    </div>
  );

  renderPasswordUser = (user) => (
    <div>
      <Row>
        <Col xs={6}>
          <AutoField name="firstName" placeholder={i18n.__('first_name')} />
        </Col>
        <Col xs={6}>
          <AutoField name="lastName" placeholder={i18n.__('last_name')} />
        </Col>
      </Row>

      <AutoField name="emailAddress" placeholder={i18n.__('email_address')} />
      <AutoField
        name="currentPassword"
        ref={(currentPassword) => {
          this.currentPassword = currentPassword;
        }}
        placeholder={i18n.__('current_password')}
      />
      <AutoField
        name="newPassword"
        ref={(newPassword) => {
          this.newPassword = newPassword;
        }}
        help="Use at least six characters."
        placeholder={i18n.__('new_password')}
      />

      <Button type="submit" bsStyle="success">
        {i18n.__('save_profile')}
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
          <Tab eventKey="profile" title="Profile">
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
                    <Button bsStyle="link" className="btn-export" onClick={this.handleExportData}>
                      Export my data
                    </Button>{' '}
                    {'-'}
                    Download all of your documents as .txt files in a .zip
                  </p>
                </AccountPageFooter>
                <AccountPageFooter>
                  <Button bsStyle="danger" onClick={this.handleDeleteAccount}>
                    Delete My Account
                  </Button>
                </AccountPageFooter>
              </Col>
            </Row>
          </Tab>
          <Tab eventKey="settings" title="Settings">
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
        Bert.alert('Profile updated!', 'success');
      },
      onError: (error) => {
        Bert.alert(error.message, 'danger');
      },
    }),
  }),
  graphql(removeUserMutation, {
    name: 'removeUser',
    options: () => ({
      onCompleted: () => {
        Bert.alert('User removed!', 'success');
      },
      onError: (error) => {
        Bert.alert(error.message, 'danger');
      },
    }),
  }),
)(withApollo(Profile));
