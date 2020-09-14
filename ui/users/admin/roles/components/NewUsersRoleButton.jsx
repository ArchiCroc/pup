import React from 'react';
import i18n from 'meteor/universe:i18n';
import Button from 'antd/lib/button';
import PlusIcon from '@ant-design/icons/PlusOutlined';
import { LinkContainer } from 'react-router-bootstrap';

const NewUsersRoleButton = (props) => (
  <LinkContainer to="/admin/users/roles/new">
    <Button type="primary" icon={<PlusIcon />} data-testid="new-users-role-button" {...props}>
      {i18n.__('UsersRoles.new_role')}
    </Button>
  </LinkContainer>
);

export default NewUsersRoleButton;
