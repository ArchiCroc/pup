import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import AutoForm from 'uniforms/AutoForm';
import AutoField from 'uniforms-bootstrap3/AutoField';
import { Row, Col, Alert, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';
import { Bert } from 'meteor/themeteorchef:bert';
import Validation from '../../components/Validation';
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
        history.push('/documents');
      }
    });
  };

  render() {
    return (
      <StyledResetPassword>
        <Row>
          <Col xs={12}>
            <h4 className="page-header">Reset Password</h4>
            <Alert bsStyle="info">
              To reset your password, enter a new one below. You will be logged in with your new
              password.
            </Alert>
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
                Reset Password &amp; Login
              </Button>

              <AccountPageFooter>
                <p>
                  {"Not sure why you're here?"} <Link to="/login">Log In</Link>.
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
