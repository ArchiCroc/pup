import React from 'react';
import i18n from 'meteor/universe:i18n';
import PageBreadcrumbs, { Breadcrumb } from '../../components/PageBreadcrumbs';
import PageHeader from '../../components/PageHeader';
// import SearchInput from '../components/SearchInput';
import AdminUsersTable from './components/AdminUsersTable';

import StyledAdminUsers from './StyledAdminUsers';

function AdminUsers({ roles, ...props }) {
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

// AdminUsers.propTypes = {
//   // prop: PropTypes.string.isRequired,
// };

export default AdminUsers;
