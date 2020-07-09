import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import { useQuery /* , useMutation */ } from '@apollo/react-hooks';
import Divider from 'antd/lib/divider';
import { useParams } from 'react-router-dom';
import hasRole from '../../modules/hasRole';
import Loading from '../components/Loading';
import PageBreadcrumbs, { Breadcrumb } from '../components/PageBreadcrumbs';
import PageHeader from '../components/PageHeader';
import NotFound from '../pages/NotFound';
import RemoveRoleButton from './components/RemoveRoleButton';
import RoleEditor from './components/RoleEditor';

import { editRole as editRoleQuery } from './queries/Roles.gql';

import StyledRoles from './StyledRoles';

function EditRole({ roles }) {
  const { name } = useParams();

  const { loading, data: { role = undefined } = {} } = useQuery(editRoleQuery, {
    variables: { name },
  });

  return (
    <StyledRoles md={16} lg={12} xl={10} xxl={8}>
      <PageBreadcrumbs>
        <Breadcrumb to="/admin/users/roles">{i18n.__('Roles.role_plural')}</Breadcrumb>
        <Breadcrumb>{i18n.__('Roles.edit_role')}</Breadcrumb>
      </PageBreadcrumbs>
      <PageHeader title={i18n.__('Roles.edit_role')} />
      {loading ? <Loading /> : <>{role ? <RoleEditor doc={role} roles={roles} /> : <NotFound />}</>}
      <Divider />
      {role && hasRole(roles, ['admin']) && <RemoveRoleButton _id={role._id} name={role.name} />}
    </StyledRoles>
  );
}

EditRole.propTypes = {
  roles: PropTypes.array.isRequired,
};

export default EditRole;
