import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';
import i18n from 'meteor/universe:i18n';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Alert from 'antd/lib/alert';
import Button from 'antd/lib/button';
import message from 'antd/lib/message';
import { TextField } from 'uniforms-antd';
import AutoForm from '/imports/ui/components/AutoForm';
import AccountPageFooter from './components/AccountPageFooter';

import StyledRecoverPasswordPage from './StyledRecoverPasswordPage';
import RecoverPasswordSchema from '/imports/common/Users/schemas/recover-password';

function RecoverPasswordPage() {
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
    <StyledRecoverPasswordPage>
      <Row>
        <Col xs={24}>
          <h4 className="page-header">{i18n.__('Users.recover_password_header')}</h4>
          <Alert type="info" message={i18n.__('Users.recover_password_help')} />
          <AutoForm name="recover-password" schema={RecoverPasswordSchema} onSubmit={handleSubmit}>
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
    </StyledRecoverPasswordPage>
  );
}

export default RecoverPasswordPage;
