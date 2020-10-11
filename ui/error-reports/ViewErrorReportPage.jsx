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
    <Descriptions.Item key="_id" label={i18n.__('ErrorReports.id')}>
      {errorReport._id}
    </Descriptions.Item>
    <Descriptions.Item key="user" label={i18n.__('ErrorReports.user')}>
      {errorReport.user?.fullName}
    </Descriptions.Item>
    <Descriptions.Item key="level" label={i18n.__('ErrorReports.level')}>
      {errorReport.level && i18n.__(`ErrorReports.level_${errorReport.level}`)}
    </Descriptions.Item>
    <Descriptions.Item key="message" label={i18n.__('ErrorReports.message')}>
      {errorReport.message}
    </Descriptions.Item>
    <Descriptions.Item key="path" label={i18n.__('ErrorReports.path')}>
      {errorReport.path}
    </Descriptions.Item>
    <Descriptions.Item key="userAgent" label={i18n.__('ErrorReports.user_agent')}>
      {errorReport.userAgent}
    </Descriptions.Item>
    <Descriptions.Item key="stack" label={i18n.__('ErrorReports.stack')}>
      {errorReport.stack && errorReport.stack.join(', ')}
    </Descriptions.Item>
    <Descriptions.Item key="reactStack" label={i18n.__('ErrorReports.react_stack')}>
      {errorReport.reactStack && errorReport.reactStack.join(', ')}
    </Descriptions.Item>
    <Descriptions.Item key="createdAt" label={i18n.__('ErrorReports.created_at')}>
      <>{errorReport.createdAt && <FormatDate timestamp={errorReport.createdAt} />}</>
    </Descriptions.Item>
    <Descriptions.Item key="createdBy" label={i18n.__('ErrorReports.created_by')}>
      {errorReport.createdBy?.fullName}
    </Descriptions.Item>
  </Descriptions>
);

ViewErrorReportFields.propTypes = {
  errorReport: PropTypes.object.isRequired,
};

export default ViewErrorReportPage;
