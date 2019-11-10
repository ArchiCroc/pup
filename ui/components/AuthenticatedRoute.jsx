import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import PageErrorBoundary from './PageErrorBoundary';
import Loading from './Loading';

function RenderAuthenticatedRoute(props) {
  const { loading, loggingIn, authenticated, component, path, ...rest } = props;

  if (loggingIn || loading) {
    return <Loading />;
  }
  return authenticated ? (
    React.createElement(PageErrorBoundary, { path }, React.createElement(component, props))
  ) : (
    <Redirect to="/login" />
  );
}

RenderAuthenticatedRoute.defaultProps = {
  loggingIn: false,
  path: '',
  exact: false,
  loading: false,
};

RenderAuthenticatedRoute.propTypes = {
  loggingIn: PropTypes.bool,
  loading: PropTypes.bool,
  authenticated: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired,
  setAfterLoginPath: PropTypes.func.isRequired,
  path: PropTypes.string,
  exact: PropTypes.bool,
};

class AuthenticatedRoute extends React.Component {
  componentWillMount() {
    if (Meteor.isClient) {
      const { setAfterLoginPath } = this.props;
      setAfterLoginPath(`${window.location.pathname}${window.location.search}`);
    }
  }

  render() {
    const { path, exact } = this.props;
    // console.log('AuthenticatedRoute', this.props);

    return (
      <Route
        path={path}
        exact={exact}
        render={(props) => RenderAuthenticatedRoute({ ...props, ...this.props })}
      />
    );
  }
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
