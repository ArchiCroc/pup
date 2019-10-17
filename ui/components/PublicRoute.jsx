import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import PageErrorBoundary from './PageErrorBoundary';

const PublicRoute = ({ component, path, exact, ...rest }) => (
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
        }),
      )
    }
  />
);

PublicRoute.defaultProps = {
  path: '',
  exact: false,
};

PublicRoute.propTypes = {
  component: PropTypes.func.isRequired,
  path: PropTypes.string,
  exact: PropTypes.bool,
};

export default PublicRoute;
