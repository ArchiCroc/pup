import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import AutoForm from 'uniforms/AutoForm';
import AutoField from 'uniforms-antd/AutoField';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Alert from 'antd/lib/alert';
import Button from 'antd/lib/button';
import { Link } from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';
import message from 'antd/lib/message';
import AccountPageFooter from './components/AccountPageFooter';
import StyledResetPassword from './StyledResetPassword';
import ResetPasswordSchema from '../../api/Users/schemas/reset-password';

function ResetPassword(props) {
  const handleSubmit = (form) => {
    const { match, history } = props;
    const { token } = match.params;

    const cleanForm = ResetPasswordSchema.clean(form);

    Accounts.resetPassword(token, cleanForm.newPassword, (error) => {
      if (error) {
        message.danger(error.reason);
      } else {
        history.push('/');
      }
    });
  };

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
            <AutoField name="newPassword" placeholder={i18n.__('Users.new_password')} />
            <AutoField
              name="repeatNewPassword"
              placeholder={i18n.__('Users.confirm_new_password')}
            />
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

ResetPassword.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default ResetPassword;
