import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import PageErrorBoundary from './PageErrorBoundary';

const PublicOnlyRoute = ({
  loggingIn,
  authenticated,
  afterLoginPath,
  component,
  path,
  exact,
  ...rest
}) => (
  <Route
    path={path}
    exact={exact}
    render={(props) =>
      !authenticated ? (
        React.createElement(
          PageErrorBoundary,
          { path },
          React.createElement(component, {
            ...props,
            ...rest,
            loggingIn,
            authenticated,
          }),
        )
      ) : (
        <Redirect to={afterLoginPath || '/'} />
      )
    }
  />
);

PublicOnlyRoute.defaultProps = {
  loggingIn: false,
  path: '',
  exact: false,
  afterLoginPath: null,
};

PublicOnlyRoute.propTypes = {
  loggingIn: PropTypes.bool,
  authenticated: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired,
  afterLoginPath: PropTypes.string,
  path: PropTypes.string,
  exact: PropTypes.bool,
};

export default PublicOnlyRoute;
