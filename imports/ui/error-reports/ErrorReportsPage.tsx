import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import PageBreadcrumbs, { Breadcrumb } from '/imports/ui/components/PageBreadcrumbs';
import PageHeader from '/imports/ui/components/PageHeader';
import ErrorReportsTable from './components/ErrorReportsTable';
import { RoleSlug } from '/imports/common/Users/interfaces';

import StyledErrorReportsPage from './StyledErrorReportsPage';

interface ErrorReportsPageProps {
  roles: RoleSlug[];
};

function ErrorReportsPage({ roles }: ErrorReportsPageProps) {
  return (
    <StyledErrorReportsPage>
      <PageBreadcrumbs>
        <Breadcrumb>{i18n.__('ErrorReports.error_report_plural')}</Breadcrumb>
      </PageBreadcrumbs>
      <PageHeader title={i18n.__('ErrorReports.error_report_plural')} />
      <ErrorReportsTable roles={roles} showNewErrorReportButton />
    </StyledErrorReportsPage>
  );
}

export default ErrorReportsPage;