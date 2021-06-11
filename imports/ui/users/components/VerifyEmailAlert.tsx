import React from 'react';
import Button from 'antd/lib/button';
import { useMutation } from '@apollo/client';
import message from 'antd/lib/message';
import i18n from 'meteor/universe:i18n';
import Alert from '/imports/ui/components/Alert';
import { SEND_VERIFICATION_EMAIL_MUTATION } from '../graphql/mutations.gql';
// import SyledVerifyEmail from './StyledVerifyEmail';

interface VerifyEmailAlertProps {
  userId: string;
  emailVerified: boolean;
  emailAddress: string;
};

const VerifyEmailAlert = ({ userId, emailVerified, emailAddress: email }: VerifyEmailAlertProps) => {
  const [sendVerificationEmail] = useMutation(SEND_VERIFICATION_EMAIL_MUTATION);

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

export default VerifyEmailAlert;
