import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import { useQuery /* , useMutation */ } from '@apollo/react-hooks';
import Divider from 'antd/lib/divider';
import PageHeader from '../components/PageHeader';
import PageBreadcrumbs, { Breadcrumb } from '../components/PageBreadcrumbs';
import ErrorReportEditor from './components/ErrorReportEditor';
import Loading from '../components/Loading';
import NotFound from '../pages/NotFound';
import RemoveErrorReportButton from './components/RemoveErrorReportButton';

import { editErrorReport as errorReportQuery } from './queries/ErrorReports.gql';

import StyledErrorReports from './StyledErrorReports';

const EditErrorReport = ({ history, match }) => {
  const { loading, data: { errorReport = undefined } = {} } = useQuery(errorReportQuery, {
    variables: { _id: match.params._id },
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
        <>
          {errorReport ? <ErrorReportEditor doc={errorReport} history={history} /> : <NotFound />}
        </>
      )}
      <Divider />
      {errorReport && (
        <RemoveErrorReportButton
          _id={errorReport._id}
          message={errorReport.message}
          history={history}
        />
      )}
    </StyledErrorReports>
  );
};

EditErrorReport.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default EditErrorReport;
