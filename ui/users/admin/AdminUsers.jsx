import React from 'react';
import i18n from 'meteor/universe:i18n';
import PageBreadcrumbs, { Breadcrumb } from '../../components/PageBreadcrumbs';
import PageHeader from '../../components/PageHeader';
// import SearchInput from '../components/SearchInput';
import AdminUsersList from './components/AdminUsersList';

import StyledAdminUsers from './StyledAdminUsers';

function AdminUsers(props) {
  return (
    <StyledAdminUsers>
      <PageBreadcrumbs>
        <Breadcrumb>{i18n.__('Users.user_plural')}</Breadcrumb>
      </PageBreadcrumbs>
      <PageHeader title={i18n.__('Users.user_plural')} />
      <AdminUsersList {...props} />
    </StyledAdminUsers>
  );
}

// AdminUsers.propTypes = {
//   // prop: PropTypes.string.isRequired,
// };

export default AdminUsers;
