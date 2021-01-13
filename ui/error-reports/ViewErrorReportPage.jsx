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
import ValueWrapper from '../components/ValueWrapper';

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
      <ValueWrapper name="_id" value={errorReport._id}>
        {errorReport._id}
      </ValueWrapper>
    </Descriptions.Item>
    <Descriptions.Item label={i18n.__('ErrorReports.user')}>
      <ValueWrapper name="user" value={errorReport.user?.fullName}>
        {errorReport.user?.fullName}
      </ValueWrapper>
    </Descriptions.Item>
    <Descriptions.Item label={i18n.__('ErrorReports.level')}>
      <ValueWrapper name="level" value={errorReport.level}>
        {errorReport.level && i18n.__(`ErrorReports.level_${errorReport.level}`)}
      </ValueWrapper>
    </Descriptions.Item>
    <Descriptions.Item label={i18n.__('ErrorReports.message')}>
      <ValueWrapper name="message" value={errorReport.message}>
        {errorReport.message}
      </ValueWrapper>
    </Descriptions.Item>
    <Descriptions.Item label={i18n.__('ErrorReports.path')}>
      <ValueWrapper name="path" value={errorReport.path}>
        {errorReport.path}
      </ValueWrapper>
    </Descriptions.Item>
    <Descriptions.Item label={i18n.__('ErrorReports.user_agent')}>
      <ValueWrapper name="userAgent" value={errorReport.userAgent}>
        {errorReport.userAgent}
      </ValueWrapper>
    </Descriptions.Item>
    <Descriptions.Item label={i18n.__('ErrorReports.stack')}>
      <ValueWrapper name="stack" value={errorReport.stack}>
        {errorReport.stack && errorReport.stack.join(', ')}
      </ValueWrapper>
    </Descriptions.Item>
    <Descriptions.Item label={i18n.__('ErrorReports.react_stack')}>
      <ValueWrapper name="reactStack" value={errorReport.reactStack}>
        {errorReport.reactStack && errorReport.reactStack.join(', ')}
      </ValueWrapper>
    </Descriptions.Item>
    <Descriptions.Item label={i18n.__('ErrorReports.created_at')}>
      <ValueWrapper name="createdAt" value={errorReport.createdAt}>
        <>{errorReport.createdAt && <FormatDate timestamp={errorReport.createdAt} />}</>
      </ValueWrapper>
    </Descriptions.Item>
    <Descriptions.Item label={i18n.__('ErrorReports.created_by')}>
      <ValueWrapper name="createdBy" value={errorReport.createdBy}>
        {errorReport.createdBy?.fullName}
      </ValueWrapper>
    </Descriptions.Item>
  </Descriptions>
);

ViewErrorReportFields.propTypes = {
  errorReport: PropTypes.object.isRequired,
};

export default ViewErrorReportPage;
