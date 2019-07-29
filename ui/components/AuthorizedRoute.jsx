import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { withRouter } from 'react-router';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

function AuthorizedRoute(props) {
  const [authorized, setAuthorized] = useState(undefined);

  const checkIfAuthorized = () => {
    const { loading, userId, userRoles, userIsInRoles, pathAfterFailure } = props;

    if (!userId) props.history.push(pathAfterFailure || '/');

    if (!loading && userRoles.length > 0) {
      if (!userIsInRoles) {
        props.history.push(pathAfterFailure || '/');
      } else {
        // Check to see if authorized is still false before setting. This prevents an infinite loop
        // when this is used within componentDidUpdate.
        if (!authorized) setAuthorized(true); // eslint-disable-line
      }
    }
  };

  if (authorized === undefined) {
    checkIfAuthorized();
  }

  const { component, path, exact, ...rest } = props;

  return authorized ? (
    <Route
      path={path}
      exact={exact}
      render={(renderProps) => React.createElement(component, { ...rest, ...renderProps })}
    />
  ) : (
    <div />
  );
}

AuthorizedRoute.defaultProps = {
  allowedGroup: null,
  userId: null,
  exact: false,
  userRoles: [],
  userIsInRoles: false,
  pathAfterFailure: '/login',
};

AuthorizedRoute.propTypes = {
  loading: PropTypes.bool.isRequired,
  allowedRoles: PropTypes.array.isRequired,
  allowedGroup: PropTypes.string,
  userId: PropTypes.string,
  component: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
  exact: PropTypes.bool,
  history: PropTypes.object.isRequired,
  userRoles: PropTypes.array,
  userIsInRoles: PropTypes.bool,
  pathAfterFailure: PropTypes.string,
};

export default withRouter(
  withTracker(
    ({ allowedRoles, allowedGroup }) =>
      // eslint-disable-line
      Meteor.isClient
        ? {
            loading: Meteor.isClient ? !Roles.subscription.ready() : true,
            userId: Meteor.userId(),
            userRoles: Roles.getRolesForUser(Meteor.userId()),
            userIsInRoles: Roles.userIsInRole(Meteor.userId(), allowedRoles, allowedGroup),
          }
        : {},
  )(AuthorizedRoute),
);
