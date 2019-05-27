import React from 'react';
import AutoForm from 'uniforms/AutoForm';
import AutoField from 'uniforms-antd/AutoField';
import i18n from 'meteor/universe:i18n';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Button from 'antd/lib/button';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import message from 'antd/lib/message';
import OAuthLoginButtons from './components/OAuthLoginButtons';
import AccountPageFooter from './components/AccountPageFooter';
import StyledSignup from './StyledSignup';
import SignupSchema from '../../api/Users/schemas/signup';

class Signup extends React.Component {
  handleSubmit = (form) => {
    const cleanForm = SignupSchema.clean(form);
    const { history } = this.props;

    Accounts.createUser(
      {
        email: cleanForm.emailAddress,
        password: cleanForm.password,
        profile: {
          name: {
            first: cleanForm.firstName,
            last: cleanForm.lastName,
          },
        },
      },
      (error) => {
        if (error) {
          message.danger(error.reason);
        } else {
          Meteor.call('users.sendVerificationEmail');
          message.success(i18n.__('Users.sign_up_success'));
          history.push('/');
        }
      },
    );
  };

  render() {
    return (
      <StyledSignup>
        <Row>
          <Col xs={12}>
            <h4 className="page-header">{i18n.__('Users.sign_up_header')}</h4>
            <Row>
              <Col xs={12}>
                <OAuthLoginButtons
                  services={['facebook', 'github', 'google']}
                  emailMessage={{
                    offset: 97,
                    text: i18n.__('Users.sign_up_with_email'),
                  }}
                />
              </Col>
            </Row>
            <AutoForm
              name="signup"
              schema={SignupSchema}
              onSubmit={this.handleSubmit}
              showInlineError
              placeholder
            >
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
                name="password"
                placeholder={i18n.__('Users.password')}
                help={i18n.__('Users.password_help')}
              />

              <Button type="submit" bsStyle="success" block>
                {i18n.__('Users.sign_up')}
              </Button>
              <AccountPageFooter>
                <p>
                  {i18n.__('Users.sign_up_page_footer')}{' '}
                  <Link to="/login">{i18n.__('Users.log_in')}</Link>.
                </p>
              </AccountPageFooter>
            </AutoForm>
          </Col>
        </Row>
      </StyledSignup>
    );
  }
}

Signup.propTypes = {
  history: PropTypes.object.isRequired,
};

export default Signup;
