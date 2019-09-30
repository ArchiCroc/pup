import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import PageErrorBoundary from './PageErrorBoundary';

const PublicRoute = ({
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
    }
  />
);

PublicRoute.defaultProps = {
  loggingIn: false,
  path: '',
  exact: false,
  afterLoginPath: null,
};

PublicRoute.propTypes = {
  loggingIn: PropTypes.bool,
  authenticated: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired,
  afterLoginPath: PropTypes.string,
  path: PropTypes.string,
  exact: PropTypes.bool,
};

export default PublicRoute;
