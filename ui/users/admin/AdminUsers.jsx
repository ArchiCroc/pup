import React from 'react';
import i18n from 'meteor/universe:i18n';
import PageHeader from '../../components/PageHeader';
// import SearchInput from '../components/SearchInput';
import AdminUsersList from './components/AdminUsersList';

import StyledAdminUsers from './StyledAdminUsers';

function AdminUsers(props) {
  return (
    <StyledAdminUsers>
      <PageHeader title={i18n.__('Users.user_plural')} />
      <AdminUsersList {...props} />
    </StyledAdminUsers>
  );
}

// AdminUsers.propTypes = {
//   // prop: PropTypes.string.isRequired,
// };

export default AdminUsers;
