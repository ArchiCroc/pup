import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import PageBreadcrumbs, { Breadcrumb } from '/imports/ui/components/PageBreadcrumbs';
import PageHeader from '/imports/ui/components/PageHeader';
import UsersRolesTable from './components/UsersRolesTable';

import StyledUsersRolesPage from './StyledUsersRolesPage';

function UsersRolesPage({ roles }) {
  return (
    <StyledUsersRolesPage>
      <PageBreadcrumbs>
        <Breadcrumb>{i18n.__('UsersRoles.role_plural')}</Breadcrumb>
      </PageBreadcrumbs>
      <PageHeader title={i18n.__('UsersRoles.role_plural')} />
      <UsersRolesTable roles={roles} showNewUsersRoleButton />
    </StyledUsersRolesPage>
  );
}

UsersRolesPage.propTypes = {
  roles: PropTypes.array.isRequired,
};

export default UsersRolesPage;
