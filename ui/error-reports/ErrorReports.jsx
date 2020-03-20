import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import PageBreadcrumbs, { Breadcrumb } from '../components/PageBreadcrumbs';
import PageHeader from '../components/PageHeader';
import ErrorReportsTable from './components/ErrorReportsTable';

import StyledErrorReports from './StyledErrorReports';

function ErrorReports({ roles }) {
  return (
    <StyledErrorReports>
      <PageBreadcrumbs>
        <Breadcrumb>{i18n.__('ErrorReports.error_report_plural')}</Breadcrumb>
      </PageBreadcrumbs>
      <PageHeader title={i18n.__('ErrorReports.error_report_plural')} />
      <ErrorReportsTable roles={roles} showNewErrorReportButton />
    </StyledErrorReports>
  );
}

ErrorReports.propTypes = {
  roles: PropTypes.array.isRequired,
};

export default ErrorReports;
