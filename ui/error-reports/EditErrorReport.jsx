import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import { useQuery /* , useMutation */ } from '@apollo/client';
import Divider from 'antd/lib/divider';
import { useParams } from 'react-router-dom';
import hasRole from '../../libs/hasRole';
import Loading from '../components/Loading';
import PageBreadcrumbs, { Breadcrumb } from '../components/PageBreadcrumbs';
import PageHeader from '../components/PageHeader';
import NotFound from '../pages/NotFoundPage';
import ErrorReportEditor from './components/ErrorReportEditor';
import RemoveErrorReportButton from './components/RemoveErrorReportButton';

import { editErrorReport as editErrorReportQuery } from './queries/ErrorReports.gql';

import StyledErrorReports from './StyledErrorReports';

function EditErrorReport({ roles }) {
  const { _id } = useParams();

  const { loading, data: { errorReport = undefined } = {} } = useQuery(editErrorReportQuery, {
    variables: { _id },
  });

  return (
    <StyledErrorReports md={16} lg={12} xl={10} xxl={8}>
      <PageBreadcrumbs>
        <Breadcrumb to="/error-reports">{i18n.__('ErrorReports.error_report_plural')}</Breadcrumb>
        <Breadcrumb>{i18n.__('ErrorReports.edit_error_report')}</Breadcrumb>
      </PageBreadcrumbs>
      <PageHeader title={i18n.__('ErrorReports.edit_error_report')} />
      {loading ? (
        <Loading />
      ) : (
        <>{errorReport ? <ErrorReportEditor doc={errorReport} roles={roles} /> : <NotFound />}</>
      )}
      <Divider />
      {errorReport && hasRole(roles, ['admin']) && (
        <RemoveErrorReportButton _id={errorReport._id} message={errorReport.message} />
      )}
    </StyledErrorReports>
  );
}

EditErrorReport.propTypes = {
  roles: PropTypes.array.isRequired,
};

export default EditErrorReport;
