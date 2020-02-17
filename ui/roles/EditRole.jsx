import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import i18n from 'meteor/universe:i18n';
import { useQuery /* , useMutation */ } from '@apollo/react-hooks';
import Divider from 'antd/lib/divider';
import PageBreadcrumbs, { Breadcrumb } from '../components/PageBreadcrumbs';
import PageHeader from '../components/PageHeader';
import RoleEditor from './components/RoleEditor';
import Loading from '../components/Loading';
import NotFound from '../pages/NotFound';
import RemoveRoleButton from './components/RemoveRoleButton';
import hasRole from '../../modules/hasRole';

import { editRole as roleQuery } from './queries/Roles.gql';

import StyledRoles from './StyledRoles';

function EditRole({ roles: userRoles }) {
  const { name } = useParams();

  const { loading, data: { role = undefined } = {} } = useQuery(roleQuery, {
    variables: { name },
  });

  return (
    <StyledRoles md={16} lg={12} xl={10} xxl={8}>
      <PageBreadcrumbs>
        <Breadcrumb to="/admin/roles">{i18n.__('Roles.role_plural')}</Breadcrumb>
        <Breadcrumb>{i18n.__('Roles.edit_role')}</Breadcrumb>
      </PageBreadcrumbs>
      <PageHeader title={i18n.__('Roles.edit_role')} />
      {loading ? (
        <Loading />
      ) : (
        <>{role ? <RoleEditor doc={role} roles={userRoles} /> : <NotFound />}</>
      )}
      <Divider />
      {role && hasRole(userRoles, ['admin']) && (
        <RemoveRoleButton _id={role._id} name={role.name} />
      )}
    </StyledRoles>
  );
}

EditRole.propTypes = {
  roles: PropTypes.array.isRequired,
};

export default EditRole;