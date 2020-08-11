import React from 'react';
import PropTypes from 'prop-types';
import Button from 'antd/lib/button';
import { useMutation } from '@apollo/client';
import message from 'antd/lib/message';
import i18n from 'meteor/universe:i18n';
import Alert from '../../components/Alert';
import { sendVerificationEmail as sendVerificationEmailMutation } from '../mutations/Users.gql';
// import SyledVerifyEmail from './StyledVerifyEmail';

const VerifyEmailAlert = ({ userId, emailVerified, emailAddress: email }) => {
  const [sendVerificationEmail] = useMutation(sendVerificationEmailMutation);

  function handleResendVerificationEmail() {
    sendVerificationEmail();
    message.success(i18n.__('Users.send_verification_email_success', { email }));
  }

  if (userId && !emailVerified) {
    return (
      <Alert showIcon banner description>
        {i18n.__('Users.please_verify_email_address', { email })}
        <Button type="link" onClick={handleResendVerificationEmail}>
          {i18n.__('Users.resend_verification_email')}
        </Button>
      </Alert>
    );
  }
  return null;
};

VerifyEmailAlert.propTypes = {
  userId: PropTypes.string.isRequired,
  emailVerified: PropTypes.bool.isRequired,
  emailAddress: PropTypes.string.isRequired,
};

export default VerifyEmailAlert;
