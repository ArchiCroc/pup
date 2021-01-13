import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import { useQuery /* , useMutation */ } from '@apollo/client';
import Divider from 'antd/lib/divider';
import { useParams } from 'react-router-dom';
import hasRole from '../../../../libs/hasRole';
import ItemNotFound from '../../../components/ItemNotFound';
import Loading from '../../../components/Loading';
import PageBreadcrumbs, { Breadcrumb } from '../../../components/PageBreadcrumbs';
import PageHeader from '../../../components/PageHeader';
import RemoveUsersRoleButton from './components/RemoveUsersRoleButton';
import UsersRoleEditor from './components/UsersRoleEditor';

import { editUsersRole as editUsersRoleQuery } from './queries/UsersRoles.gql';

import StyledUsersRolesPage from './StyledUsersRolesPage';

function EditUsersRolePage({ roles }) {
  const { name } = useParams();

  const { loading, data: { usersRole = undefined } = {} } = useQuery(editUsersRoleQuery, {
    variables: { name },
  });

  return (
    <StyledUsersRolesPage md={16} lg={12} xl={10} xxl={8}>
      <PageBreadcrumbs>
        <Breadcrumb to="/admin/users/roles">{i18n.__('UsersRoles.role_plural')}</Breadcrumb>
        <Breadcrumb>{i18n.__('UsersRoles.edit_role')}</Breadcrumb>
      </PageBreadcrumbs>
      <PageHeader title={i18n.__('UsersRoles.edit_role')} />
      {loading ? (
        <Loading />
      ) : (
        <>
          {usersRole ? (
            <UsersRoleEditor doc={usersRole} roles={roles} />
          ) : (
            <ItemNotFound
              title={i18n.__('UsersRoles.role_not_found_title')}
              message={i18n.__('UsersRoles.role_not_found_message')}
            />
          )}
        </>
      )}
      <Divider />
      {usersRole && hasRole(roles, ['admin']) && (
        <RemoveUsersRoleButton _id={usersRole._id} title={usersRole.name} />
      )}
    </StyledUsersRolesPage>
  );
}

EditUsersRolePage.propTypes = {
  roles: PropTypes.array.isRequired,
};

export default EditUsersRolePage;
