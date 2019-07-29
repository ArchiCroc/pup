import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import OAuthLoginButton from './OAuthLoginButton';
import oAuthServicesQuery from '../queries/OAuth.gql';
import StyledOAuthLoginButtons from './StyledOAuthLoginButtons';

const OAuthLoginButtons = ({ services }) => {
  const { loading, data } = useQuery(oAuthServicesQuery, {
    variables: {
      services,
    },
  });
  return data.length ? (
    <StyledOAuthLoginButtons>
      {data.map((service) => (
        <OAuthLoginButton key={service} service={service} />
      ))}
    </StyledOAuthLoginButtons>
  ) : (
    <div />
  );
};
OAuthLoginButtons.propTypes = {
  services: PropTypes.array.isRequired,
};

export default OAuthLoginButtons;
