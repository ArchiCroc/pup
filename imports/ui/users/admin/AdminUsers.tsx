import React from 'react';
import i18n from 'meteor/universe:i18n';
import PageBreadcrumbs, { Breadcrumb } from '/imports/ui/components/PageBreadcrumbs';
import PageHeader from '/imports/ui/components/PageHeader';
// import SearchInput from '/imports/ui/components/SearchInput';
import AdminUsersTable from './components/AdminUsersTable';

import StyledAdminUsers from './StyledAdminUsers';

// interface AdminUsersProps {
//   roles: UserRole[];
// }

function AdminUsers(props: object) {
  return (
    <StyledAdminUsers>
      <PageBreadcrumbs>
        <Breadcrumb>{i18n.__('Users.user_plural')}</Breadcrumb>
      </PageBreadcrumbs>
      <PageHeader title={i18n.__('Users.user_plural')} />
      <AdminUsersTable {...props} />
    </StyledAdminUsers>
  );
}


export default AdminUsers;
