import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';

function AuthenticatedRoute(props) {
  useEffect(() => {
    if (Meteor.isClient)
      props.setAfterLoginPath(`${window.location.pathname}${window.location.search}`);
  });

  const { loggingIn, authenticated, component, path, exact, ...rest } = props;

  return (
    <Route
      path={path}
      exact={exact}
      render={(renderProps) =>
        authenticated ? (
          React.createElement(component, {
            ...renderProps,
            ...rest,
            loggingIn,
            authenticated,
          })
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
}

AuthenticatedRoute.defaultProps = {
  loggingIn: false,
  path: '',
  exact: false,
};

AuthenticatedRoute.propTypes = {
  loggingIn: PropTypes.bool,
  authenticated: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired,
  setAfterLoginPath: PropTypes.func.isRequired,
  path: PropTypes.string,
  exact: PropTypes.bool,
};

export default AuthenticatedRoute;
