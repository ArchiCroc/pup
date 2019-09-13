import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import { useMutation } from '@apollo/react-hooks';
import Alert from 'antd/lib/alert';
import { Accounts } from 'meteor/accounts-base';
import message from 'antd/lib/message';
import { sendWelcomeEmail as sendWelcomeEmailMutation } from './mutations/Users.gql';

const VerifyEmail = ({ history, match }) => {
  const [error, setError] = useState(null);
  const [sendWelcomeEmail] = useMutation(sendWelcomeEmailMutation);

  useEffect(() => {
    Accounts.verifyEmail(match.params.token, (error2) => {
      if (error2) {
        message.error(error2.reason);
        setError(i18n.__('Users.verify_email_error', { error: error2.reason }));
      } else {
        setTimeout(() => {
          message.success(i18n.__('Users.verify_email_success'));
          sendWelcomeEmail();
          history.push('/');
        }, 1500);
      }
    });
  }, [match.params.token]);

  return (
    <div className="VerifyEmail">
      <Alert type={!error ? 'info' : 'danger'}>{!error ? i18n.__('Users.verifying') : error}</Alert>
    </div>
  );
};

VerifyEmail.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default VerifyEmail;
