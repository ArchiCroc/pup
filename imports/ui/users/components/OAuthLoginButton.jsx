import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import message from 'antd/lib/message';
import FacebookIcon from '@ant-design/icons/FacebookOutlined';
import GithubIcon from '@ant-design/icons/GithubOutlined';
import GoogleIcon from '@ant-design/icons/GoogleOutlined';
import StyledOAuthLoginButton from './StyledOAuthLoginButton';

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
      <FacebookIcon />
      {' Log In with Facebook'}
    </span>
  ),
  github: (
    <span>
      <GithubIcon />
      {' Log In with GitHub'}
    </span>
  ),
  google: (
    <span>
      <GoogleIcon />
      {' Log In with Google'}
    </span>
  ),
};

const OAuthLoginButton = ({ service, callback }) => (
  <StyledOAuthLoginButton
    className={`OAuthLoginButton OAuthLoginButton-${service}`}
    type="button"
    onClick={() => handleLogin(service, callback)}
  >
    {serviceLabel[service]}
  </StyledOAuthLoginButton>
);

OAuthLoginButton.defaultProps = {
  callback: (error) => {
    if (error) message.error(error.message);
  },
};

OAuthLoginButton.propTypes = {
  service: PropTypes.string.isRequired,
  callback: PropTypes.func,
};

export default OAuthLoginButton;
