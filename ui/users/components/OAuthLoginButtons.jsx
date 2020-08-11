import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import OAuthLoginButton from './OAuthLoginButton';
import oAuthServicesQuery from '../queries/OAuth.gql';
import StyledOAuthLoginButtons from './StyledOAuthLoginButtons';
import Loading from '../../components/Loading';

const OAuthLoginButtons = ({ services }) => {
  const { loading, data: { oAuthServices } = {} } = useQuery(oAuthServicesQuery, {
    variables: {
      services,
    },
  });
  return (
    <StyledOAuthLoginButtons>
      {loading ? (
        <Loading />
      ) : (
        <>
          {oAuthServices.length ? (
            <>
              {oAuthServices.map((service) => (
                <OAuthLoginButton key={service} service={service} />
              ))}
            </>
          ) : (
            <React.Fragment />
          )}
        </>
      )}
    </StyledOAuthLoginButtons>
  );
};

OAuthLoginButtons.propTypes = {
  services: PropTypes.array.isRequired,
};

export default OAuthLoginButtons;
