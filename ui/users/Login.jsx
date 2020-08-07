import React from 'react';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import i18n from 'meteor/universe:i18n';
import Button from 'antd/lib/button';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Divider from 'antd/lib/divider';
import message from 'antd/lib/message';
import { TextField /*, ErrorsField*/ } from 'uniforms-antd';
import AutoForm from '../components/AutoForm';

import OAuthLoginButtons from './components/OAuthLoginButtons';
import AccountPageFooter from './components/AccountPageFooter';
import { StyledLogin, LoginPromo } from './StyledLogin';

import LoginSchema from '../../api/Users/schemas/login';

function Login() {
  function handleSubmit(form) {
    const cleanForm = LoginSchema.clean(form);

    Meteor.loginWithPassword(cleanForm.emailAddress, cleanForm.password, (error) => {
      if (error) {
        message.error(error.reason);
      } else {
        message.success(i18n.__('Users.login_success'));
      }
    });
  }

  return (
    <StyledLogin>
      <Row className="login">
        <Col sm={24} md={12} lg={12}>
          <LoginPromo>
            <header>
              <h4>{i18n.__('Users.login_promo_header')}</h4>
              <p>{i18n.__('Users.login_promo_body')}</p>
            </header>
          </LoginPromo>
        </Col>
        <Col sm={24} md={12} lg={12} className="login-form">
          <h2 className="page-header">{i18n.__('Users.login_header')}</h2>
          {/* @todo add check to hide diver if not using oauth */}
          <OAuthLoginButtons services={['facebook', 'github', 'google']} />
          <Divider>{i18n.__('Users.login_with_email')}</Divider>
          <AutoForm name="login" schema={LoginSchema} onSubmit={handleSubmit}>
            {/* <ErrorsField /> */}
            <TextField name="emailAddress" placeholder={i18n.__('Users.email_address')} />
            <TextField name="password" placeholder={i18n.__('Users.password')} />

            <Link className="pull-right" to="/recover-password">
              {i18n.__('Users.forgot_password')}
            </Link>

            <Button htmlType="submit" type="primary" block>
              {i18n.__('Users.log_in')}
            </Button>
            <AccountPageFooter>
              <p>
                {i18n.__('Users.login_footer')} <Link to="/signup">{i18n.__('Users.sign_up')}</Link>
              </p>
            </AccountPageFooter>
          </AutoForm>
        </Col>
      </Row>
    </StyledLogin>
  );
}

export default Login;
