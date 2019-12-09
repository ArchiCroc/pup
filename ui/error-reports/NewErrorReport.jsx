import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import PageBreadcrumbs, { Breadcrumb } from '../components/PageBreadcrumbs';
import PageHeader from '../components/PageHeader';
import ErrorReportEditor from './components/ErrorReportEditor';

import StyledErrorReports from './StyledErrorReports';

const NewErrorReport = ({ history }) => (
  <StyledErrorReports md={16} lg={12} xl={10} xxl={8}>
    <PageBreadcrumbs>
      <Breadcrumb to="/error-reports">{i18n.__('ErrorReports.error_report_plural')}</Breadcrumb>
      <Breadcrumb>{i18n.__('ErrorReports.new_error_report')}</Breadcrumb>
    </PageBreadcrumbs>
    <PageHeader title={i18n.__('ErrorReports.new_error_report')} />
    <ErrorReportEditor history={history} />
  </StyledErrorReports>
);

NewErrorReport.propTypes = {
  history: PropTypes.object.isRequired,
};

export default NewErrorReport;
