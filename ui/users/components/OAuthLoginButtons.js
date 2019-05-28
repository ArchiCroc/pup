import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import OAuthLoginButton from './OAuthLoginButton';
import oAuthServicesQuery from '../queries/OAuth.gql';
import StyledOAuthLoginButtons from './StyledOAuthLoginButtons';

const OAuthLoginButtons = ({ services }) =>
  services.length ? (
    <StyledOAuthLoginButtons>
      {services.map((service) => (
        <OAuthLoginButton key={service} service={service} />
      ))}
    </StyledOAuthLoginButtons>
  ) : (
    <div />
  );

OAuthLoginButtons.propTypes = {
  services: PropTypes.array.isRequired,
};

export default graphql(oAuthServicesQuery, {
  options: ({ services }) => ({
    variables: {
      services,
    },
  }),
})(OAuthLoginButtons);
