/* eslint-disable jsx-a11y/no-href,react/jsx-props-no-spreading */

import React from 'react';
import PropTypes from 'prop-types';

import { Meteor } from 'meteor/meteor';
import { Roles as MeteorRoles } from 'meteor/alanning:roles';
import { Switch, Route } from 'react-router-dom';

import Layout from 'antd/lib/layout';
import PageContainer from '../components/PageContainer';

import Navigation from '../components/Navigation';

import PageErrorBoundary from '../components/PageErrorBoundary';

import AuthenticatedRoute from '../components/AuthenticatedRoute';
import AuthorizedRoute from '../components/AuthorizedRoute';
import PublicOnlyRoute from '../components/PublicOnlyRoute';
import PublicRoute from '../components/PublicRoute';

/* #### PLOP_IMPORTS_START #### */

/* #### PAGES_IMPORTS_START #### */
import IndexPage from '../pages/IndexPage';
import TermsPage from '../pages/TermsPage';
import PrivacyPage from '../pages/PrivacyPage';
import ExamplePage from '../pages/ExamplePage';
/* #### PAGES_IMPORTS_END #### */

/* #### ERROR_REPORTS_IMPORTS_START #### */
import ErrorReports from '../error-reports/ErrorReports';
import ViewErrorReport from '../error-reports/ViewErrorReport';
import NewErrorReport from '../error-reports/NewErrorReport';
import EditErrorReport from '../error-reports/EditErrorReport';
/* #### ERROR_REPORTS_IMPORTS_END #### */

/* #### USERS_ROLES_IMPORTS_START #### */
import UsersRolesPage from '../users/admin/roles/UsersRolesPage';
import ViewUsersRolePage from '../users/admin/roles/ViewUsersRolePage';
import NewUsersRolePage from '../users/admin/roles/NewUsersRolePage';
import EditUsersRolePage from '../users/admin/roles/EditUsersRolePage';
/* #### USERS_ROLES_IMPORTS_END #### */

/* #### USERS_IMPORTS_START #### */
import ProfilePage from '../users/ProfilePage';
import SignupPage from '../users/SignupPage';
import LoginPage from '../users/LoginPage';
import LogoutPage from '../users/LogoutPage';
import NotFoundPage from '../pages/NotFoundPage';
import VerifyEmailPage from '../users/VerifyEmailPage';
import RecoverPasswordPage from '../users/RecoverPasswordPage';
import ResetPasswordPage from '../users/ResetPasswordPage';

import AdminUsers from '../users/admin/AdminUsers';
import AdminUser from '../users/admin/AdminUser';
/* #### USERS_IMPORTS_END #### */
/* #### PLOP_IMPORTS_END #### */

import Footer from '../components/Footer';

import VerifyEmailAlert from '../users/components/VerifyEmailAlert';
import GDPRConsentModal from '../users/components/GDPRConsentModal';

import withTrackerSsr from '../../libs/withTrackerSsr';
import getUserName from '../../libs/getUserName';

import StyledApp from './StyledApp';

class App extends React.Component {
  state = { ready: false, afterLoginPath: null };

  componentDidMount() {
    const { ready } = this.state;
    const { loading, loggingIn } = this.props;
    // console.log('app mounted', this.props);
    if (!ready && !loading && !loggingIn) {
      this.setPageReady();
    }
  }

  componentDidUpdate() {
    const { ready } = this.state;
    const { loading, loggingIn } = this.props;
    // console.log('app updated', this.props);
    if (!ready && !loading && !loggingIn) {
      this.setPageReady();
    }
  }

  setPageReady = () => {
    this.setState({ ready: true });
  };

  setAfterLoginPath = (afterLoginPath) => {
    this.setState({ afterLoginPath });
  };

  render() {
    const { props, state, setAfterLoginPath } = this;
    return (
      <StyledApp ready={state.ready} loading={`${props.loading}`}>
        <PageErrorBoundary>
          {props.authenticated && (
            <VerifyEmailAlert
              userId={props.userId}
              emailVerified={props.emailVerified}
              emailAddress={props.emailAddress}
            />
          )}
          {props.authenticated && <GDPRConsentModal userId={props.userId} />}
          <Layout className="layout">
            <Layout.Header>
              <Navigation {...props} {...state} />
            </Layout.Header>
            <Layout.Content className="content">
              <PageContainer className="app-grid">
                <PageErrorBoundary>
                  <Switch>
                    {/* #### PLOP_ROUTES_START #### */}

                    {/* #### ERROR_REPORTS_ROUTES_START #### */}
                    <AuthenticatedRoute
                      exact
                      path="/error-reports"
                      component={ErrorReports}
                      setAfterLoginPath={setAfterLoginPath}
                      {...props}
                      {...state}
                    />
                    <AuthenticatedRoute
                      exact
                      path="/error-reports/new"
                      component={NewErrorReport}
                      setAfterLoginPath={setAfterLoginPath}
                      {...props}
                      {...state}
                    />
                    <AuthenticatedRoute
                      exact
                      path="/error-reports/:_id"
                      component={ViewErrorReport}
                      setAfterLoginPath={setAfterLoginPath}
                      {...props}
                      {...state}
                    />
                    <AuthenticatedRoute
                      exact
                      path="/error-reports/:_id/edit"
                      component={EditErrorReport}
                      setAfterLoginPath={setAfterLoginPath}
                      {...props}
                      {...state}
                    />
                    {/* #### ERROR_REPORTS_ROUTES_END #### */}

                    {/* #### USERS_ROLES_ROUTES_START #### */}
                    <AuthenticatedRoute
                      exact
                      path="/admin/users/roles"
                      component={UsersRolesPage}
                      setAfterLoginPath={setAfterLoginPath}
                      {...props}
                      {...state}
                    />
                    <AuthenticatedRoute
                      exact
                      path="/admin/users/roles/new"
                      component={NewUsersRolePage}
                      setAfterLoginPath={setAfterLoginPath}
                      {...props}
                      {...state}
                    />
                    <AuthenticatedRoute
                      exact
                      path="/admin/users/roles/:name"
                      component={ViewUsersRolePage}
                      setAfterLoginPath={setAfterLoginPath}
                      {...props}
                      {...state}
                    />
                    <AuthenticatedRoute
                      exact
                      path="/admin/users/roles/:name/edit"
                      component={EditUsersRolePage}
                      setAfterLoginPath={setAfterLoginPath}
                      {...props}
                      {...state}
                    />
                    {/* #### USERS_ROLES_ROUTES_END #### */}

                    {/* #### USERS_ROUTES_START #### */}
                    <AuthenticatedRoute
                      exact
                      path="/user/:tab?"
                      component={ProfilePage}
                      setAfterLoginPath={setAfterLoginPath}
                      {...props}
                      {...state}
                    />
                    <PublicOnlyRoute path="/signup" component={SignupPage} {...props} {...state} />
                    <PublicOnlyRoute path="/login" component={LoginPage} {...props} {...state} />
                    <Route
                      path="/logout"
                      render={(routeProps) => (
                        <LogoutPage {...routeProps} setAfterLoginPath={setAfterLoginPath} />
                      )}
                      {...props}
                      {...state}
                    />

                    <PublicRoute
                      name="verify-email"
                      path="/verify-email/:token"
                      component={VerifyEmailPage}
                    />
                    <PublicRoute
                      name="recover-password"
                      path="/recover-password"
                      component={RecoverPasswordPage}
                    />
                    <PublicRoute
                      name="reset-password"
                      path="/reset-password/:token"
                      component={ResetPasswordPage}
                    />
                    <AuthorizedRoute
                      exact
                      allowedRoles={['admin']}
                      path="/admin/users"
                      pathAfterFailure="/"
                      component={AdminUsers}
                      setAfterLoginPath={setAfterLoginPath}
                      {...props}
                      {...state}
                    />
                    <AuthorizedRoute
                      exact
                      allowedRoles={['admin']}
                      path="/admin/users/:_id/:tab?"
                      pathAfterFailure="/"
                      component={AdminUser}
                      setAfterLoginPath={setAfterLoginPath}
                      {...props}
                      {...state}
                    />
                    {/* #### USERS_ROUTES_END #### */}

                    {/* #### PAGES_ROUTES_START #### */}
                    <PublicRoute exact name="index" path="/" component={IndexPage} />
                    <PublicRoute name="terms" path="/terms" component={TermsPage} />
                    <PublicRoute name="privacy" path="/privacy" component={PrivacyPage} />
                    {/* #### PAGES_ROUTES_END #### */}

                    {/* #### PLOP_ROUTES_END #### */}
                    <Route component={NotFoundPage} />
                  </Switch>
                </PageErrorBoundary>
              </PageContainer>
            </Layout.Content>
            <Layout.Footer className="footer">
              <Footer />
            </Layout.Footer>
          </Layout>
        </PageErrorBoundary>
      </StyledApp>
    );
  }
}

App.defaultProps = {
  loading: true,
  userId: '',
  emailAddress: '',
  emailVerified: false,
  authenticated: false,
  loggingIn: false,
};

App.propTypes = {
  loading: PropTypes.bool,
  loggingIn: PropTypes.bool,
  userId: PropTypes.string,
  emailAddress: PropTypes.string,
  emailVerified: PropTypes.bool,
  authenticated: PropTypes.bool,
};

export default withTrackerSsr(() => {
  const app = Meteor.subscribe('app');
  const loggingIn = Meteor.loggingIn();
  const user = Meteor.user();
  const userId = Meteor.userId();
  const loading = !app.ready() && !MeteorRoles.subscription.ready();
  const name = user && user.profile && getUserName(user.profile);
  const emailAddress = user && user.emails && user.emails[0].address;

  return {
    loading,
    loggingIn,
    authenticated: !loggingIn && !!userId,
    name: name || emailAddress,
    roles: MeteorRoles.getRolesForUser(userId),
    userId,
    emailAddress,
    emailVerified: user && user.emails ? user.emails[0] && user.emails[0].verified : true,
  };
})(App);
