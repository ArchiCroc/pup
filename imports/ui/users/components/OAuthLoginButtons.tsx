import React from 'react';
import { useQuery } from '@apollo/client';
import OAuthLoginButton from './OAuthLoginButton';
import { OAUTH_SERVICES_QUERY } from '../graphql/queries.gql';
import StyledOAuthLoginButtons from './StyledOAuthLoginButtons';
import Loading from '/imports/ui/components/Loading';

interface OAuthLoginButtonsProps {
  services: string[];
};

const OAuthLoginButtons = ({ services }: OAuthLoginButtonsProps) => {
  const { loading, data: { oAuthServices } = {} } = useQuery(OAUTH_SERVICES_QUERY, {
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
          {oAuthServices?.length ? (
            <>
              {oAuthServices.map((service: string) => (
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

export default OAuthLoginButtons;
