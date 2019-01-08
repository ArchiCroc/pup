import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import AutoForm from 'uniforms/AutoForm';
import AutoField from 'uniforms-bootstrap3/AutoField';
import { Row, Col, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';
import { Bert } from 'meteor/themeteorchef:bert';
import AccountPageFooter from '../../components/AccountPageFooter';
import StyledResetPassword from './styles';
import ResetPasswordSchema from '../../../api/Users/schemas/reset-password';

class ResetPassword extends React.Component {
  handleSubmit = (form) => {
    const { match, history } = this.props;
    const { token } = match.params;

    const cleanForm = ResetPasswordSchema.clean(form);

    Accounts.resetPassword(token, cleanForm.newPassword, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert(i18n.__('reset_password_succcess'), 'success');
        history.push('/documents');
      }
    });
  };

  render() {
    return (
      <StyledResetPassword>
        <Row>
          <Col xs={12}>
            <h4 className="page-header">{i18n.__('reset_password_header')}</h4>
            <Alert bsStyle="info">{i18n.__('reset_password_help')}</Alert>
            <AutoForm
              name="reset-password"
              schema={ResetPasswordSchema}
              onSubmit={this.handleSubmit}
              showInlineError
              placeholder
            >
              <AutoField name="newPassword" placeholder={i18n.__('new_password')} />
              <AutoField name="repeatNewPassword" placeholder={i18n.__('confirm_new_password')} />
              <Button type="submit" bsStyle="success">
                {i18n.__('reset_password_submit')}
              </Button>

              <AccountPageFooter>
                <p>
                  {i18n.__('reset_password_page_footer')}{' '}
                  <Link to="/login">{i18n.__('log_in')}</Link>.
                </p>
              </AccountPageFooter>
            </AutoForm>
          </Col>
        </Row>
      </StyledResetPassword>
    );
  }
}

ResetPassword.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default ResetPassword;
