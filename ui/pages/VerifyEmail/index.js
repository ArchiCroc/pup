import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import { graphql } from 'react-apollo';
import { Alert } from 'react-bootstrap';
import { Accounts } from 'meteor/accounts-base';
import { Bert } from 'meteor/themeteorchef:bert';
import { sendWelcomeEmail as sendWelcomeEmailMutation } from '../../mutations/Users.gql';

class VerifyEmail extends React.Component {
  state = { error: null };

  componentDidMount() {
    const { match, history } = this.props;
    Accounts.verifyEmail(match.params.token, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
        this.setState({ error: i18n.__('verify_email_error', { error: error.reason }) });
      } else {
        setTimeout(() => {
          Bert.alert(i18n.__('verify_email_success'), 'success');
          this.props.sendWelcomeEmail();
          history.push('/documents');
        }, 1500);
      }
    });
  }

  render() {
    return (
      <div className="VerifyEmail">
        <Alert bsStyle={!this.state.error ? 'info' : 'danger'}>
          {!this.state.error ? i18n.__('verifying') : this.state.error}
        </Alert>
      </div>
    );
  }
}

VerifyEmail.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  sendWelcomeEmail: PropTypes.func.isRequired,
};

export default graphql(sendWelcomeEmailMutation, {
  name: 'sendWelcomeEmail',
})(VerifyEmail);
