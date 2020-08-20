import React from 'react';
import i18n from 'meteor/universe:i18n';
import PageBreadcrumbs, { Breadcrumb } from '../components/PageBreadcrumbs';
import PageHeader from '../components/PageHeader';
import ErrorReportEditor from './components/ErrorReportEditor';

import StyledErrorReportsPage from './StyledErrorReportsPage';

function NewErrorReportPage() {
  return (
    <StyledErrorReportsPage md={16} lg={12} xl={10} xxl={8}>
      <PageBreadcrumbs>
        <Breadcrumb to="/admin/error-reports">
          {i18n.__('ErrorReports.error_report_plural')}
        </Breadcrumb>
        <Breadcrumb>{i18n.__('ErrorReports.new_error_report')}</Breadcrumb>
      </PageBreadcrumbs>
      <PageHeader title={i18n.__('ErrorReports.new_error_report')} />
      <ErrorReportEditor />
    </StyledErrorReportsPage>
  );
}

export default NewErrorReportPage;
