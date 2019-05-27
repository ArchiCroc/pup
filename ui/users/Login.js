import React from 'react';
import AutoForm from 'uniforms/AutoForm';
import AutoField from 'uniforms-bootstrap3/AutoField';
import i18n from 'meteor/universe:i18n';
import { Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import OAuthLoginButtons from './components/OAuthLoginButtons';
import AccountPageFooter from './components/AccountPageFooter';
import { StyledLogin, LoginPromo } from './StyledLogin';
import LoginSchema from '../../api/Users/schemas/login';

class Login extends React.Component {
  handleSubmit = (form) => {
    const cleanForm = LoginSchema.clean(form);
    Meteor.loginWithPassword(cleanForm.emailAddress, cleanForm.password, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Welcome back!', 'success');
      }
    });
  };

  render() {
    return (
      <StyledLogin>
        <LoginPromo>
          <header>
            <img
              src="http://cleverbeagle-assets.s3.amazonaws.com/graphics/pup-document-graphic.png"
              alt="Clever Beagle"
            />
            <h4>Introducing Documents</h4>
            <p>Keep track of your ideas, privately and publicly.</p>
          </header>
        </LoginPromo>
        <Row>
          <Col xs={12}>
            <h4 className="page-header">Log In</h4>
            <Row>
              <Col xs={12}>
                <OAuthLoginButtons
                  services={['facebook', 'github', 'google']}
                  emailMessage={{
                    offset: 100,
                    text: 'Log In with an Email Address',
                  }}
                />
              </Col>
            </Row>
            <AutoForm
              name="login"
              schema={LoginSchema}
              onSubmit={this.handleSubmit}
              showInlineError
              placeholder
            >
              <AutoField name="emailAddress" placeholder={i18n.__('email_address')} />
              <AutoField name="password" placeholder={i18n.__('password')} />

              <Link className="pull-right" to="/recover-password">
                {i18n.__('forgot_password')}
              </Link>

              <Button type="submit" bsStyle="success" block>
                Log In
              </Button>
              <AccountPageFooter>
                <p>
                  {"Don't have an account?"} <Link to="/signup">Sign Up</Link>.
                </p>
              </AccountPageFooter>
            </AutoForm>
          </Col>
        </Row>
      </StyledLogin>
    );
  }
}

export default Login;
