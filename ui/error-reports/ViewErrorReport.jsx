import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import { useQuery } from '@apollo/react-hooks';
import Descriptions from 'antd/lib/descriptions';
import { useParams } from 'react-router-dom';
import hasRole from '../../modules/hasRole';
import FormatDate from '../components/FormatDate';
import Loading from '../components/Loading';
import PageBreadcrumbs, { Breadcrumb } from '../components/PageBreadcrumbs';
import PageHeader from '../components/PageHeader';
import NotFound from '../pages/NotFound';

import EditErrorReportButton from './components/EditErrorReportButton';

import { errorReport as errorReportQuery } from './queries/ErrorReports.gql';

import StyledErrorReports from './StyledErrorReports';

function ViewErrorReport({ roles }) {
  const { _id } = useParams();

  const { loading, data: { errorReport } = {} } = useQuery(errorReportQuery, {
    variables: { _id },
  });

  return (
    <StyledErrorReports>
      {loading ? (
        <Loading />
      ) : (
        <>
          <PageBreadcrumbs>
            <Breadcrumb to="/error-reports">
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
            <NotFound />
          )}
        </>
      )}
    </StyledErrorReports>
  );
}

ViewErrorReport.propTypes = {
  roles: PropTypes.array.isRequired,
};

const ViewErrorReportFields = ({ errorReport }) => (
  <Descriptions bordered column={1}>
    <Descriptions.Item label={i18n.__('ErrorReports.user')}>
      {errorReport.user?.fullName}
    </Descriptions.Item>
    <Descriptions.Item label={i18n.__('ErrorReports.level')}>
      {errorReport.level && i18n.__(`ErrorReports.level_${errorReport.level}`)}
    </Descriptions.Item>
    <Descriptions.Item label={i18n.__('ErrorReports.message')}>
      {errorReport.message}
    </Descriptions.Item>
    <Descriptions.Item label={i18n.__('ErrorReports.path')}>{errorReport.path}</Descriptions.Item>
    <Descriptions.Item label={i18n.__('ErrorReports.user_agent')}>
      {errorReport.userAgent}
    </Descriptions.Item>
    <Descriptions.Item label={i18n.__('ErrorReports.stack')}>
      {errorReport.stack && errorReport.stack.join(', ')}
    </Descriptions.Item>
    <Descriptions.Item label={i18n.__('ErrorReports.react_stack')}>
      {errorReport.reactStack && errorReport.reactStack.join(', ')}
    </Descriptions.Item>
    <Descriptions.Item label={i18n.__('ErrorReports.created_at_utc')}>
      <>{errorReport.createdAtUTC && <FormatDate timestamp={errorReport.createdAtUTC} />}</>
    </Descriptions.Item>
    <Descriptions.Item label={i18n.__('ErrorReports.created_by')}>
      {errorReport.createdBy?.fullName}
    </Descriptions.Item>
  </Descriptions>
);

ViewErrorReportFields.propTypes = {
  errorReport: PropTypes.object.isRequired,
};

export default ViewErrorReport;
