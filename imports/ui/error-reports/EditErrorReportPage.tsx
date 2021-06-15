import React from 'react';
import i18n from 'meteor/universe:i18n';
import { useQuery /* , useMutation */ } from '@apollo/client';
import Divider from 'antd/lib/divider';
import { useParams } from 'react-router-dom';
import hasRole from '/imports/common/libs/hasRole';
import ItemNotFound from '/imports/ui/components/ItemNotFound';
import Loading from '/imports/ui/components/Loading';
import PageBreadcrumbs, { Breadcrumb } from '/imports/ui/components/PageBreadcrumbs';
import PageHeader from '/imports/ui/components/PageHeader';
import ErrorReportEditor from './components/ErrorReportEditor';
import RemoveErrorReportButton from './components/RemoveErrorReportButton';
import { RoleSlug } from '/imports/common/Users/interfaces';

import { editErrorReport as editErrorReportQuery } from './graphql/queries.gql';

import StyledErrorReportsPage from './StyledErrorReportsPage';

interface EditErrorReportPageProps {
  roles: RoleSlug[]
}

function EditErrorReportPage({ roles }: EditErrorReportPageProps) {
  const { _id } = useParams<{_id: string}>();

  const { loading, data: { errorReport = undefined } = {} } = useQuery(editErrorReportQuery, {
    variables: { _id },
  });

  return (
    <StyledErrorReportsPage md={16} lg={12} xl={10} xxl={8}>
      <PageBreadcrumbs>
        <Breadcrumb to="/admin/error-reports">
          {i18n.__('ErrorReports.error_report_plural')}
        </Breadcrumb>
        <Breadcrumb>{i18n.__('ErrorReports.edit_error_report')}</Breadcrumb>
      </PageBreadcrumbs>
      <PageHeader title={i18n.__('ErrorReports.edit_error_report')} />
      {loading ? (
        <Loading />
      ) : (
        <>
          {errorReport ? (
            <ErrorReportEditor doc={errorReport} roles={roles} />
          ) : (
            <ItemNotFound
              title={i18n.__('ErrorReports.error_report_not_found_title')}
              message={i18n.__('ErrorReports.error_report_not_found_message')}
            />
          )}
        </>
      )}
      <Divider />
      {errorReport && hasRole(roles, ['admin']) && (
        <RemoveErrorReportButton _id={errorReport._id} title={errorReport.message} />
      )}
    </StyledErrorReportsPage>
  );
}

export default EditErrorReportPage;