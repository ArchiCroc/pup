import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import PageBreadcrumbs, { Breadcrumb } from '../components/PageBreadcrumbs';
import PageHeader from '../components/PageHeader';
import RoleEditor from './components/RoleEditor';

import StyledRoles from './StyledRoles';

const NewRole = () => (
  <StyledRoles md={16} lg={12} xl={10} xxl={8}>
    <PageBreadcrumbs>
      <Breadcrumb to="/admin/users/roles">{i18n.__('Roles.role_plural')}</Breadcrumb>
      <Breadcrumb>{i18n.__('Roles.new_role')}</Breadcrumb>
    </PageBreadcrumbs>
    <PageHeader title={i18n.__('Roles.new_role')} />
    <RoleEditor />
  </StyledRoles>
);

export default NewRole;
