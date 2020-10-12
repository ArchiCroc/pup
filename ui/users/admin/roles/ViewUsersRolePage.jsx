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
import ValueWrapper from '../../../components/ValueWrapper';

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
    <Descriptions.Item label={i18n.__('UsersRoles.id')}>
      <ValueWrapper name="_id" value={usersRole._id}>
        {usersRole._id}
      </ValueWrapper>
    </Descriptions.Item>
    <Descriptions.Item label={i18n.__('UsersRoles.name')}>
      <ValueWrapper name="name" value={usersRole.name}>
        {usersRole.name}
      </ValueWrapper>
    </Descriptions.Item>
    <Descriptions.Item label={i18n.__('UsersRoles.created_at')}>
      <ValueWrapper name="createdAt" value={usersRole.createdAt}>
        <>{usersRole.createdAt && <FormatDate timestamp={usersRole.createdAt} />}</>
      </ValueWrapper>
    </Descriptions.Item>
    <Descriptions.Item label={i18n.__('UsersRoles.created_by')}>
      <ValueWrapper name="createdBy" value={usersRole.createdBy}>
        {usersRole.createdBy?.fullName}
      </ValueWrapper>
    </Descriptions.Item>
    <Descriptions.Item label={i18n.__('UsersRoles.updated_at')}>
      <ValueWrapper name="updatedAt" value={usersRole.updatedAt}>
        <>{usersRole.updatedAt && <FormatDate timestamp={usersRole.updatedAt} />}</>
      </ValueWrapper>
    </Descriptions.Item>
    <Descriptions.Item label={i18n.__('UsersRoles.updated_by')}>
      <ValueWrapper name="updatedBy" value={usersRole.updatedBy}>
        {usersRole.updatedBy?.fullName}
      </ValueWrapper>
    </Descriptions.Item>
  </Descriptions>
);

ViewUsersRoleFields.propTypes = {
  usersRole: PropTypes.object.isRequired,
};

export default ViewUsersRolePage;
