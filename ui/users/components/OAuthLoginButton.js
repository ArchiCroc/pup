import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import message from 'antd/lib/message';
import Icon from '../../components/Icon';
import Styles from './StyledOAuthLoginButton';

const handleLogin = (service, callback) => {
  const options = {
    facebook: {
      requestPermissions: ['email'],
      loginStyle: 'popup',
    },
    github: {
      requestPermissions: ['user:email'],
      loginStyle: 'popup',
    },
    google: {
      requestPermissions: ['email', 'profile'],
      requestOfflineToken: true,
      loginStyle: 'popup',
    },
  }[service];

  return {
    facebook: Meteor.loginWithFacebook,
    github: Meteor.loginWithGithub,
    google: Meteor.loginWithGoogle,
  }[service](options, callback);
};

const serviceLabel = {
  facebook: (
    <span>
      <Icon iconStyle="brand" icon="facebook" /> Log In with Facebook
    </span>
  ),
  github: (
    <span>
      <Icon iconStyle="brand" icon="github" /> Log In with GitHub
    </span>
  ),
  google: (
    <span>
      <Icon iconStyle="brand" icon="google" /> Log In with Google
    </span>
  ),
};

const OAuthLoginButton = ({ service, callback }) => (
  <Styles.OAuthLoginButton
    className={`OAuthLoginButton OAuthLoginButton-${service}`}
    type="button"
    onClick={() => handleLogin(service, callback)}
  >
    {serviceLabel[service]}
  </Styles.OAuthLoginButton>
);

OAuthLoginButton.defaultProps = {
  callback: (error) => {
    if (error) message.danger(error.message);
  },
};

OAuthLoginButton.propTypes = {
  service: PropTypes.string.isRequired,
  callback: PropTypes.func,
};

export default OAuthLoginButton;
