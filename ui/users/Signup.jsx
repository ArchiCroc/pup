import React from 'react';
import PropTypes from 'prop-types';
import AutoForm from 'uniforms/AutoForm';
import AutoField from 'uniforms-antd/AutoField';
import i18n from 'meteor/universe:i18n';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Button from 'antd/lib/button';
import Divider from 'antd/lib/divider';

import { Link } from 'react-router-dom';
// import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import message from 'antd/lib/message';
import OAuthLoginButtons from './components/OAuthLoginButtons';
import AccountPageFooter from './components/AccountPageFooter';
import StyledSignup from './StyledSignup';
import SignupSchema from '../../api/Users/schemas/signup';

const Signup = ({ history }) => {
  function handleSubmit(form) {
    const cleanForm = SignupSchema.clean(form);

    Accounts.createUser(
      {
        email: cleanForm.emailAddress,
        password: cleanForm.password,
        profile: {
          firstName: cleanForm.firstName,
          lastName: cleanForm.lastName,
        },
      },
      (error) => {
        if (error) {
          message.error(error.reason);
        } else {
          message.success(i18n.__('Users.sign_up_success'));
          history.push('/');
        }
      },
    );
  }

  return (
    <StyledSignup>
      <Row>
        <Col xs={24}>
          <h2 className="page-header">{i18n.__('Users.sign_up_header')}</h2>
          <OAuthLoginButtons services={['facebook', 'github', 'google']} />
          <Divider>{i18n.__('Users.sign_up_with_email')}</Divider>
          <AutoForm
            name="signup"
            schema={SignupSchema}
            onSubmit={handleSubmit}
            showInlineError
            placeholder
          >
            <Row gutter={16}>
              <Col xs={12}>
                <AutoField name="firstName" />
              </Col>
              <Col xs={12}>
                <AutoField name="lastName" />
              </Col>
            </Row>
            <AutoField name="emailAddress" />
            <AutoField
              name="password"
              placeholder={i18n.__('Users.password')}
              help={i18n.__('Users.password_help')}
            />

            <Button htmlType="submit" type="primary" block>
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
};

Signup.propTypes = {
  history: PropTypes.object.isRequired,
};

export default Signup;
