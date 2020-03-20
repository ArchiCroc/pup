import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import PageBreadcrumbs, { Breadcrumb } from '../components/PageBreadcrumbs';
import PageHeader from '../components/PageHeader';
import RolesTable from './components/RolesTable';

import StyledRoles from './StyledRoles';

function Roles({ roles }) {
  return (
    <StyledRoles>
      <PageBreadcrumbs>
        <Breadcrumb>{i18n.__('Roles.role_plural')}</Breadcrumb>
      </PageBreadcrumbs>
      <PageHeader title={i18n.__('Roles.role_plural')} />
      <RolesTable roles={roles} showNewRoleButton />
    </StyledRoles>
  );
}

Roles.propTypes = {
  roles: PropTypes.array.isRequired,
};

export default Roles;
