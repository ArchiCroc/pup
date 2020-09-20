import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import { useQuery } from '@apollo/client';
import Descriptions from 'antd/lib/descriptions';
import { useParams } from 'react-router-dom';
import hasRole from '../../libs/hasRole';
import FormatDate from '../components/FormatDate';
import ItemNotFound from '../components/ItemNotFound';
import Loading from '../components/Loading';
import PageBreadcrumbs, { Breadcrumb } from '../components/PageBreadcrumbs';
import PageHeader from '../components/PageHeader';

import EditErrorReportButton from './components/EditErrorReportButton';

import { errorReport as errorReportQuery } from './queries/ErrorReports.gql';

import StyledErrorReportsPage from './StyledErrorReportsPage';

function ViewErrorReportPage({ roles }) {
  const { _id } = useParams();

  const { loading, data: { errorReport } = {} } = useQuery(errorReportQuery, {
    variables: { _id },
  });

  return (
    <StyledErrorReportsPage>
      {loading ? (
        <Loading />
      ) : (
        <>
          <PageBreadcrumbs>
            <Breadcrumb to="/admin/error-reports">
              {i18n.__('ErrorReports.error_report_plural')}
            </Breadcrumb>
            <Breadcrumb>{errorReport.message}</Breadcrumb>
          </PageBreadcrumbs>
          <PageHeader title={errorReport.message} />
          {errorReport && hasRole(roles, ['admin']) && (
            <p>
              <EditErrorReportButton _id={errorReport._id} />
            </p>
          )}
          {errorReport ? (
            <>
              <ViewErrorReportFields errorReport={errorReport} />
            </>
          ) : (
            <ItemNotFound
              title={i18n.__('ErrorReports.error_report_not_found_title')}
              message={i18n.__('ErrorReports.error_report_not_found_message')}
            />
          )}
        </>
      )}
    </StyledErrorReportsPage>
  );
}

ViewErrorReportPage.propTypes = {
  roles: PropTypes.array.isRequired,
};

const ViewErrorReportFields = ({ errorReport }) => (
  <Descriptions bordered column={1}>
    <Descriptions.Item label={i18n.__('ErrorReports.id')}>
      <div data-testid="error-report-id">{errorReport._id}</div>
    </Descriptions.Item>
    <Descriptions.Item label={i18n.__('ErrorReports.user')}>
      <div data-testid="error-report-user">{errorReport.user?.fullName}</div>
    </Descriptions.Item>
    <Descriptions.Item label={i18n.__('ErrorReports.level')}>
      <div data-testid="error-report-level">
        {errorReport.level && i18n.__(`ErrorReports.level_${errorReport.level}`)}
      </div>
    </Descriptions.Item>
    <Descriptions.Item label={i18n.__('ErrorReports.message')}>
      <div data-testid="error-report-message">{errorReport.message}</div>
    </Descriptions.Item>
    <Descriptions.Item label={i18n.__('ErrorReports.path')}>
      <div data-testid="error-report-path">{errorReport.path}</div>
    </Descriptions.Item>
    <Descriptions.Item label={i18n.__('ErrorReports.user_agent')}>
      <div data-testid="error-report-user-agent">{errorReport.userAgent}</div>
    </Descriptions.Item>
    <Descriptions.Item label={i18n.__('ErrorReports.stack')}>
      <div data-testid="error-report-stack">
        {errorReport.stack && errorReport.stack.join(', ')}
      </div>
    </Descriptions.Item>
    <Descriptions.Item label={i18n.__('ErrorReports.react_stack')}>
      <div data-testid="error-report-react-stack">
        {errorReport.reactStack && errorReport.reactStack.join(', ')}
      </div>
    </Descriptions.Item>
    <Descriptions.Item label={i18n.__('ErrorReports.created_at_utc')}>
      <div data-testid="error-report-created-at-utc">
        <>{errorReport.createdAtUTC && <FormatDate timestamp={errorReport.createdAtUTC} />}</>
      </div>
    </Descriptions.Item>
    <Descriptions.Item label={i18n.__('ErrorReports.created_by')}>
      <div data-testid="error-report-created-by">{errorReport.createdBy?.fullName}</div>
    </Descriptions.Item>
  </Descriptions>
);

ViewErrorReportFields.propTypes = {
  errorReport: PropTypes.object.isRequired,
};

export default ViewErrorReportPage;
