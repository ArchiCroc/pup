import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import { useQuery } from '@apollo/client';
import Descriptions from 'antd/lib/descriptions';
import { useParams } from 'react-router-dom';
import hasRole from '../../../../libs/hasRole';
import FormatDate from '../../../components/FormatDate';
import ItemNotFound from '../../../components/ItemNotFound';
import Loading from '../../../components/Loading';
import PageBreadcrumbs, { Breadcrumb } from '../../../components/PageBreadcrumbs';
import PageHeader from '../../../components/PageHeader';

import EditUsersRoleButton from './components/EditUsersRoleButton';

import { usersRole as usersRoleQuery } from './queries/UsersRoles.gql';

import StyledUsersRolesPage from './StyledUsersRolesPage';

function ViewUsersRolePage({ roles }) {
  const { name } = useParams();

  const { loading, data: { usersRole } = {} } = useQuery(usersRoleQuery, { variables: { name } });

  return (
    <StyledUsersRolesPage>
      {loading ? (
        <Loading />
      ) : (
        <>
          <PageBreadcrumbs>
            <Breadcrumb to="/admin/users/roles">{i18n.__('UsersRoles.role_plural')}</Breadcrumb>
            <Breadcrumb>{usersRole.name}</Breadcrumb>
          </PageBreadcrumbs>
          <PageHeader title={usersRole.name} />
          {usersRole && hasRole(roles, ['admin']) && (
            <p>
              <EditUsersRoleButton name={usersRole.name} />
            </p>
          )}
          {usersRole ? (
            <>
              <ViewUsersRoleFields usersRole={usersRole} />
            </>
          ) : (
            <ItemNotFound
              title={i18n.__('UsersRoles.role_not_found_title')}
              message={i18n.__('UsersRoles.role_not_found_message')}
            />
          )}
        </>
      )}
    </StyledUsersRolesPage>
  );
}

ViewUsersRolePage.propTypes = {
  roles: PropTypes.array.isRequired,
};

const ViewUsersRoleFields = ({ usersRole }) => (
  <Descriptions bordered column={1}>
    <Descriptions.Item label={i18n.__('UsersRoles.name')}>
      <div data-testid="users-role-name">{usersRole.name}</div>
    </Descriptions.Item>
    <Descriptions.Item label={i18n.__('UsersRoles.created_at')}>
      <div data-testid="users-role-created-at">
        <>{usersRole.createdAt && <FormatDate timestamp={usersRole.createdAt} />}</>
      </div>
    </Descriptions.Item>
    <Descriptions.Item label={i18n.__('UsersRoles.created_by')}>
      <div data-testid="users-role-created-by">{usersRole.createdBy?.fullName}</div>
    </Descriptions.Item>
    <Descriptions.Item label={i18n.__('UsersRoles.updated_at')}>
      <div data-testid="users-role-updated-at">
        <>{usersRole.updatedAt && <FormatDate timestamp={usersRole.updatedAt} />}</>
      </div>
    </Descriptions.Item>
    <Descriptions.Item label={i18n.__('UsersRoles.updated_by')}>
      <div data-testid="users-role-updated-by">{usersRole.updatedBy?.fullName}</div>
    </Descriptions.Item>
  </Descriptions>
);

ViewUsersRoleFields.propTypes = {
  usersRole: PropTypes.object.isRequired,
};

export default ViewUsersRolePage;
