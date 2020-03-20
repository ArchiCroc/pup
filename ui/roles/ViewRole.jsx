import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import i18n from 'meteor/universe:i18n';
import { useQuery } from '@apollo/react-hooks';
import Descriptions from 'antd/lib/descriptions';
import hasRole from '../../modules/hasRole';
import FormatDate from '../components/FormatDate';
import Loading from '../components/Loading';
import PageBreadcrumbs, { Breadcrumb } from '../components/PageBreadcrumbs';
import PageHeader from '../components/PageHeader';
import NotFound from '../pages/NotFound';
import EditRoleButton from './components/EditRoleButton';

import { role as roleQuery } from './queries/Roles.gql';

import StyledRoles from './StyledRoles';

function ViewRole({ roles }) {
  const { name } = useParams();
  const { loading, data: { role } = {} } = useQuery(roleQuery, { variables: { name } });

  return (
    <StyledRoles>
      {loading ? (
        <Loading />
      ) : (
        <>
          <PageBreadcrumbs>
            <Breadcrumb to="/admin/users/roles">{i18n.__('Roles.role_plural')}</Breadcrumb>
            <Breadcrumb>{role.name}</Breadcrumb>
          </PageBreadcrumbs>
          <PageHeader title={role.name} />
          {role && hasRole(roles, ['admin']) && (
            <p>
              <EditRoleButton name={role.name} />
            </p>
          )}
          {role ? (
            <ViewRoleFields role={role} />
          ) : (
            <NotFound />
          )}
        </>
      )}
    </StyledRoles>
  );
};

ViewRole.propTypes = {
  roles: PropTypes.array.isRequired,
};

const ViewRoleFields = ({ role }) => (
  <Descriptions bordered column={1}>
    <Descriptions.Item label={i18n.__('Roles.name')}>
      {role.name}
    </Descriptions.Item>
    <Descriptions.Item label={i18n.__('Roles.created_at_utc')}>
      {role.createdAtUTC && <FormatDate timestamp={role.createdAtUTC} />}
    </Descriptions.Item>
    <Descriptions.Item label={i18n.__('Roles.created_by')}>
      {role.createdBy && role.createdBy.fullName}
    </Descriptions.Item>
    <Descriptions.Item label={i18n.__('Roles.updated_at_utc')}>
      {role.updatedAtUTC && <FormatDate timestamp={role.updatedAtUTC} />}
    </Descriptions.Item>
    <Descriptions.Item label={i18n.__('Roles.updated_by')}>
      {role.updatedBy && role.updatedBy.fullName}
    </Descriptions.Item>
  </Descriptions>
);


ViewRoleFields.propTypes = {
  role: PropTypes.object.isRequired,
};

export default ViewRole;
