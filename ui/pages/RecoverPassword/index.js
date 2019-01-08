import React from 'react';
import i18n from 'meteor/universe:i18n';
import AutoForm from 'uniforms/AutoForm';
import AutoField from 'uniforms-bootstrap3/AutoField';
import { Row, Col, Alert, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';
import { Bert } from 'meteor/themeteorchef:bert';
import AccountPageFooter from '../../components/AccountPageFooter';
import StyledRecoverPassword from './styles';
import RecoverPasswordSchema from '../../../api/Users/schemas/recover-password';

class RecoverPassword extends React.Component {
  handleSubmit = (form) => {
    const cleanForm = RecoverPasswordSchema.clean(form);

    const { history } = this.props;
    const email = cleanForm.emailAddress;

    Accounts.forgotPassword({ email }, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert(i18n.__('recover_email_success', { email }), 'success');
        history.push('/login');
      }
    });
  };

  render() {
    return (
      <StyledRecoverPassword>
        <Row>
          <Col xs={12}>
            <h4 className="page-header">{i18n.__('recover_password_header')}</h4>
            <Alert bsStyle="info">{i18n.__('recover_password_help')}</Alert>
            <AutoForm
              name="recover-password"
              schema={RecoverPasswordSchema}
              onSubmit={this.handleSubmit}
              showInlineError
              placeholder
            >
              <AutoField name="emailAddress" placeholder={i18n.__('email_address')} />
              <Button type="submit" bsStyle="success">
                {i18n.__('recover_password_submit')}
              </Button>
              <AccountPageFooter>
                <p>
                  {i18n.__('recover_password_footer')} <Link to="/login">Log In</Link>.
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
