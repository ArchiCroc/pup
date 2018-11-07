import React from 'react';
import AutoForm from 'uniforms/AutoForm';
import AutoField from 'uniforms-bootstrap3/AutoField';
import i18n from 'meteor/universe:i18n';
import { Row, Col, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Bert } from 'meteor/themeteorchef:bert';

import OAuthLoginButtons from '../../components/OAuthLoginButtons';
import AccountPageFooter from '../../components/AccountPageFooter';
import StyledSignup from './styles';
import SignupSchema from '../../../api/Users/schemas/signup';

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
          Bert.alert(error.reason, 'danger');
        } else {
          Meteor.call('users.sendVerificationEmail');
          Bert.alert('Welcome!', 'success');
          history.push('/documents');
        }
      },
    );
  };

  render() {
    return (
      <StyledSignup>
        <Row>
          <Col xs={12}>
            <h4 className="page-header">Sign Up</h4>
            <Row>
              <Col xs={12}>
                <OAuthLoginButtons
                  services={['facebook', 'github', 'google']}
                  emailMessage={{
                    offset: 97,
                    text: 'Sign Up with an Email Address',
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
                  <AutoField name="firstName" placeholder={i18n.__('first_name')} />
                </Col>
                <Col xs={6}>
                  <AutoField name="lastName" placeholder={i18n.__('last_name')} />
                </Col>
              </Row>
              <AutoField name="emailAddress" placeholder={i18n.__('email_address')} />
              <AutoField
                name="password"
                placeholder={i18n.__('password')}
                help={i18n.__('password_help')}
              />

              <Button type="submit" bsStyle="success" block>
                {i18n.__('sign_up')}
              </Button>
              <AccountPageFooter>
                <p>
                  Already have an account? <Link to="/login">Log In</Link>.
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
