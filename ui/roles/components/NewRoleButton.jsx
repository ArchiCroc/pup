import React from 'react';
import i18n from 'meteor/universe:i18n';
import Button from 'antd/lib/button';
import PlusIcon from '@ant-design/icons/PlusOutlined';
import { LinkContainer } from 'react-router-bootstrap';

const NewRoleButton = (props) => (
  <LinkContainer to="/admin/users/roles/new">
    <Button type="primary" icon={<PlusIcon />} {...props}>
      {i18n.__('Roles.new_role')}
    </Button>
  </LinkContainer>
);

export default NewRoleButton;
