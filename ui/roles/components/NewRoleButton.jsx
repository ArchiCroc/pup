import React from 'react';
import i18n from 'meteor/universe:i18n';
import Button from 'antd/lib/button';
import { LinkContainer } from 'react-router-bootstrap';

const NewRoleButton = (props) => (
  <LinkContainer to="/roles/new">
    <Button type="primary" icon="plus" {...props}>
      {i18n.__('Roles.new_role')}
    </Button>
  </LinkContainer>
);

export default NewRoleButton;
