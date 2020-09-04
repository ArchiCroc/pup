import React from 'react';
import i18n from 'meteor/universe:i18n';
import PageBreadcrumbs, { Breadcrumb } from '../../../components/PageBreadcrumbs';
import PageHeader from '../../../components/PageHeader';
import UsersRoleEditor from './components/UsersRoleEditor';

import StyledUsersRolesPage from './StyledUsersRolesPage';

function NewUsersRolePage() {
  return (
    <StyledUsersRolesPage md={16} lg={12} xl={10} xxl={8}>
      <PageBreadcrumbs>
        <Breadcrumb to="/admin/users/roles">{i18n.__('UsersRoles.role_plural')}</Breadcrumb>
        <Breadcrumb>{i18n.__('UsersRoles.new_role')}</Breadcrumb>
      </PageBreadcrumbs>
      <PageHeader title={i18n.__('UsersRoles.new_role')} />
      <UsersRoleEditor />
    </StyledUsersRolesPage>
  );
}

export default NewUsersRolePage;
