import React from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
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
import StyledResetPassword from './StyledResetPassword';
import ResetPasswordSchema from '../../api/Users/schemas/reset-password';

function ResetPassword() {
  const history = useHistory();
  const { token } = useParams();

  function handleSubmit(form) {
    const cleanForm = ResetPasswordSchema.clean(form);

    Accounts.resetPassword(token, cleanForm.newPassword, (error) => {
      if (error) {
        message.error(error.reason);
      } else {
        history.push('/');
      }
    });
  }

  return (
    <StyledResetPassword>
      <Row>
        <Col xs={12}>
          <h4 className="page-header">{i18n.__('Users.reset_password_header')}</h4>
          <Alert type="info" message={i18n.__('Users.reset_password_help')} />
          <AutoForm
            name="reset-password"
            schema={ResetPasswordSchema}
            onSubmit={handleSubmit}
            showInlineError
            placeholder
          >
            <TextField name="newPassword" />
            <TextField name="repeatNewPassword" />
            <Button htmlType="submit" type="primary">
              {i18n.__('Users.reset_password_submit')}
            </Button>

            <AccountPageFooter>
              <p>
                {i18n.__('Users.reset_password_footer')}{' '}
                <Link to="/login">{i18n.__('Users.log_in')}</Link>.
              </p>
            </AccountPageFooter>
          </AutoForm>
        </Col>
      </Row>
    </StyledResetPassword>
  );
}

export default ResetPassword;
