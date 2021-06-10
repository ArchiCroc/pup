import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';
import i18n from 'meteor/universe:i18n';
import { useMutation } from '@apollo/client';
import message from 'antd/lib/message';
import Alert from '/imports/ui/components/Alert';

import { sendWelcomeEmail as sendWelcomeEmailMutation } from './mutations/Users.gql';

function VerifyEmailPage() {
  const history = useHistory();
  const { token } = useParams();
  const [error, setError] = useState(null);
  const [sendWelcomeEmail] = useMutation(sendWelcomeEmailMutation);

  useEffect(() => {
    Accounts.verifyEmail(token, (error2) => {
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
  }, [token]);

  return (
    <div className="VerifyEmail">
      <Alert type={!error ? 'info' : 'danger'}>{!error ? i18n.__('Users.verifying') : error}</Alert>
    </div>
  );
}

export default VerifyEmailPage;
