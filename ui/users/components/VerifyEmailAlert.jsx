import React from 'react';
import PropTypes from 'prop-types';
import Alert from '../../components/Alert';
import Button from 'antd/lib/button';
import { graphql } from 'react-apollo';
import message from 'antd/lib/message';
import { sendVerificationEmail as sendVerificationEmailMutation } from '../mutations/Users.gql';
import SyledVerifyEmail from './StyledVerifyEmail';

const handleResendVerificationEmail = (emailAddress, sendVerificationEmail) => {
  sendVerificationEmail();
  message.success(`Check ${emailAddress} for a verification link!`);
};

const VerifyEmailAlert = ({ userId, emailVerified, emailAddress, sendVerificationEmail }) =>
  userId && !emailVerified ? (
    <Alert className="verify-email text-center" showIcon banner>
      Hey friend! Can you <strong>verify your email address</strong> ({emailAddress}) for us?
      <Button
        type="default"
        onClick={() => handleResendVerificationEmail(emailAddress, sendVerificationEmail)}
        href="#"
      >
        Re-send verification email
      </Button>
    </Alert>
  ) : null;

VerifyEmailAlert.propTypes = {
  userId: PropTypes.string.isRequired,
  emailVerified: PropTypes.bool.isRequired,
  emailAddress: PropTypes.string.isRequired,
  sendVerificationEmail: PropTypes.func.isRequired,
};

export default graphql(sendVerificationEmailMutation, {
  name: 'sendVerificationEmail',
})(VerifyEmailAlert);
