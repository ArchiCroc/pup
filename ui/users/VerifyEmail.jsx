import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import { graphql } from 'react-apollo';
import Alert from 'antd/lib/alert';
import { Accounts } from 'meteor/accounts-base';
import message from 'antd/lib/message';
import { sendWelcomeEmail as sendWelcomeEmailMutation } from './mutations/Users.gql';

class VerifyEmail extends React.Component {
  state = { error: null };

  componentDidMount() {
    const { match, history } = this.props;
    Accounts.verifyEmail(match.params.token, (error) => {
      if (error) {
        message.danger(error.reason);
        this.setState({ error: i18n.__('Users.verify_email_error', { error: error.reason }) });
      } else {
        setTimeout(() => {
          message.success(i18n.__('Users.verify_email_success'));
          this.props.sendWelcomeEmail();
          history.push('/');
        }, 1500);
      }
    });
  }

  render() {
    return (
      <div className="VerifyEmail">
        <Alert type={!this.state.error ? 'info' : 'danger'}>
          {!this.state.error ? i18n.__('Users.verifying') : this.state.error}
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
