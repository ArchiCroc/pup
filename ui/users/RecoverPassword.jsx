import React from 'react';
import i18n from 'meteor/universe:i18n';
import AutoForm from 'uniforms/AutoForm';
import AutoField from 'uniforms-antd/AutoField';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Alert from 'antd/lib/alert';
import Button from 'antd/lib/button';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';
import message from 'antd/lib/message';
import AccountPageFooter from './components/AccountPageFooter';
import StyledRecoverPassword from './StyledRecoverPassword';
import RecoverPasswordSchema from '../../api/Users/schemas/recover-password';

class RecoverPassword extends React.Component {
  handleSubmit = (form) => {
    const cleanForm = RecoverPasswordSchema.clean(form);

    const { history } = this.props;
    const email = cleanForm.emailAddress;

    Accounts.forgotPassword({ email }, (error) => {
      if (error) {
        message.danger(error.reason);
      } else {
        message.success(i18n.__('Users.recover_email_success', { email }));
        history.push('/login');
      }
    });
  };

  render() {
    return (
      <StyledRecoverPassword>
        <Row>
          <Col xs={12}>
            <h4 className="page-header">{i18n.__('Users.recover_password_header')}</h4>
            <Alert type="info" message={i18n.__('Users.recover_password_help')} />
            <AutoForm
              name="recover-password"
              schema={RecoverPasswordSchema}
              onSubmit={this.handleSubmit}
              showInlineError
              placeholder
            >
              <AutoField name="emailAddress" placeholder={i18n.__('Users.email_address')} />
              <Button type="submit" type="primary">
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
}

RecoverPassword.propTypes = {
  history: PropTypes.object.isRequired,
};

export default RecoverPassword;
