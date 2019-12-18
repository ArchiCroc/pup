import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';
import i18n from 'meteor/universe:i18n';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Alert from 'antd/lib/alert';
import Button from 'antd/lib/button';
import message from 'antd/lib/message';
import AutoForm from 'uniforms/AutoForm';
import TextField from 'uniforms-antd/TextField';

import AccountPageFooter from './components/AccountPageFooter';
import StyledRecoverPassword from './StyledRecoverPassword';
import RecoverPasswordSchema from '../../api/Users/schemas/recover-password';

function RecoverPassword() {
  const history = useHistory();

  const handleSubmit = (form) => {
    const cleanForm = RecoverPasswordSchema.clean(form);
    const email = cleanForm.emailAddress;

    Accounts.forgotPassword({ email }, (error) => {
      if (error) {
        message.error(error.reason);
      } else {
        message.success(i18n.__('Users.recover_email_success', { email }));
        history.push('/login');
      }
    });
  };

  return (
    <StyledRecoverPassword>
      <Row>
        <Col xs={24}>
          <h4 className="page-header">{i18n.__('Users.recover_password_header')}</h4>
          <Alert type="info" message={i18n.__('Users.recover_password_help')} />
          <AutoForm
            name="recover-password"
            schema={RecoverPasswordSchema}
            onSubmit={handleSubmit}
            showInlineError
            placeholder
          >
            <TextField name="emailAddress" />
            <Button htmlType="submit" type="primary">
              {i18n.__('Users.recover_password_submit')}
            </Button>
            <AccountPageFooter>
              <p>
                {i18n.__('Users.recover_password_footer')}{' '}
                <Link to="/login">{i18n.__('Users.log_in')}</Link>.
              </p>
            </AccountPageFooter>
          </AutoForm>
        </Col>
      </Row>
    </StyledRecoverPassword>
  );
}

export default RecoverPassword;
