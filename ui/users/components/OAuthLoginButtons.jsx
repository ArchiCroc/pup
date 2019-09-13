import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import OAuthLoginButton from './OAuthLoginButton';
import oAuthServicesQuery from '../queries/OAuth.gql';
import StyledOAuthLoginButtons from './StyledOAuthLoginButtons';
import Loading from '../../components/Loading';

const OAuthLoginButtons = ({ emailMessage, services }) => {
  const { loading, data } = useQuery(oAuthServicesQuery, {
    variables: {
      services,
    },
  });
  return (
    <StyledOAuthLoginButtons>
      {loading ? (
        <Loading />
      ) : (
        <React.Fragment>
          {data.oAuthServices.length ? (
            <>
              {data.oAuthServices.map((service) => (
                <OAuthLoginButton key={service} service={service} />
              ))}
              {emailMessage && <>{emailMessage.text}</>}
            </>
          ) : (
            <React.Fragment />
          )}
        </React.Fragment>
      )}
    </StyledOAuthLoginButtons>
  );
};

OAuthLoginButtons.propTypes = {
  services: PropTypes.array.isRequired,
  emailMessage: PropTypes.object.isRequired,
};

export default OAuthLoginButtons;
