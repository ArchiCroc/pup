/* eslint-disable jsx-a11y/no-href,react/jsx-props-no-spreading */

import React from 'react';
import PropTypes from 'prop-types';

import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Switch, Route } from 'react-router-dom';

import Layout from 'antd/lib/layout';
import Grid from '../components/Grid';

import Navigation from '../components/Navigation';

import PageErrorBoundary from '../components/PageErrorBoundary';

import AuthenticatedRoute from '../components/AuthenticatedRoute';
import AuthorizedRoute from '../components/AuthorizedRoute';
import PublicOnlyRoute from '../components/PublicOnlyRoute';
import PublicRoute from '../components/PublicRoute';

import Index from '../pages/Index';

import Documents from '../documents/Documents';
import ViewDocument from '../documents/ViewDocument';
import EditDocument from '../documents/EditDocument';

/* #### PLOP_IMPORTS_START #### */
/* #### ERROR_REPORTS_IMPORTS_START #### */
import ErrorReports from '../error-reports/ErrorReports';
import ViewErrorReport from '../error-reports/ViewErrorReport';
import NewErrorReport from '../error-reports/NewErrorReport';
import EditErrorReport from '../error-reports/EditErrorReport';
/* #### ERROR_REPORTS_IMPORTS_END #### */
/* #### PLOP_IMPORTS_END #### */

import Profile from '../users/Profile';
import Signup from '../users/Signup';
import Login from '../users/Login';
import Logout from '../users/Logout';

import VerifyEmail from '../users/VerifyEmail';
import RecoverPassword from '../users/RecoverPassword';
import ResetPassword from '../users/ResetPassword';

import AdminUsers from '../users/admin/AdminUsers';
import AdminUser from '../users/admin/AdminUser';

import NotFound from '../pages/NotFound';
import Footer from '../components/Footer';

import Terms from '../pages/Terms';
import Privacy from '../pages/Privacy';
import ExamplePage from '../pages/ExamplePage';

import VerifyEmailAlert from '../users/components/VerifyEmailAlert';
import GDPRConsentModal from '../users/components/GDPRConsentModal';

import withTrackerSsr from '../../modules/withTrackerSsr';
import getUserName from '../../modules/getUserName';

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
            <Grid className="app-grid">
              <PageErrorBoundary>
                <Switch>
                  {/* #### PLOP_ROUTES_START #### */}
                  {/* #### ERROR_REPORTS_ROUTES_START #### */}
                  <PublicRoute exact name="index" path="/" component={Index} />
                  <PublicRoute name="terms" path="/terms" component={Terms} />
                  <PublicRoute name="privacy" path="/privacy" component={Privacy} />
                  <PublicRoute name="examplePage" path="/example-page" component={ExamplePage} />
                  {/* #### ERROR_REPORTS_ROUTES_END #### */}
                  {/* #### DOCUMENTS_ROUTES_START #### */}
                  <AuthenticatedRoute
                    exact
                    path="/documents"
                    component={Documents}
                    setAfterLoginPath={setAfterLoginPath}
                    {...props}
                    {...state}
                  />
                  <PublicRoute exact path="/documents/:_id" component={ViewDocument} />
                  <AuthenticatedRoute
                    exact
                    path="/documents/:_id/edit"
                    component={EditDocument}
                    setAfterLoginPath={setAfterLoginPath}
                    {...props}
                    {...state}
                  />
                  {/* #### DOCUMENTS_ROUTES_END #### */}
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
                  {/* #### USERS_ROUTES_START #### */}
                  <AuthenticatedRoute
                    exact
                    path="/user/:tab?"
                    component={Profile}
                    setAfterLoginPath={setAfterLoginPath}
                    {...props}
                    {...state}
                  />
                  <PublicOnlyRoute path="/signup" component={Signup} {...props} {...state} />
                  <PublicOnlyRoute path="/login" component={Login} {...props} {...state} />
                  <Route
                    path="/logout"
                    render={(routeProps) => (
                      <Logout {...routeProps} setAfterLoginPath={setAfterLoginPath} />
                    )}
                    {...props}
                    {...state}
                  />

                  <PublicRoute
                    name="verify-email"
                    path="/verify-email/:token"
                    component={VerifyEmail}
                  />
                  <PublicRoute
                    name="recover-password"
                    path="/recover-password"
                    component={RecoverPassword}
                  />
                  <PublicRoute
                    name="reset-password"
                    path="/reset-password/:token"
                    component={ResetPassword}
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
                  {/* #### USERS_ROUTES_START #### */}
                  {/* #### PLOP_ROUTES_END #### */}
                  <Route component={NotFound} />
                </Switch>
              </PageErrorBoundary>
            </Grid>
          </Layout.Content>
          <Layout.Footer className="footer">
            <Footer />
          </Layout.Footer>
        </Layout>
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
  const loading = !app.ready() && !Roles.subscription.ready();
  const name = user && user.profile && getUserName(user.profile);
  const emailAddress = user && user.emails && user.emails[0].address;

  return {
    loading,
    loggingIn,
    authenticated: !loggingIn && !!userId,
    name: name || emailAddress,
    roles: Roles.getRolesForUser(userId),
    userId,
    emailAddress,
    emailVerified: user && user.emails ? user.emails[0] && user.emails[0].verified : true,
  };
})(App);
