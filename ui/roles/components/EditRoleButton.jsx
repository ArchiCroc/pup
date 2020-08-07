import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import Button from 'antd/lib/button';
import EditIcon from '@ant-design/icons/EditOutlined';
import { LinkContainer } from 'react-router-bootstrap';

const EditRoleButton = ({ name, ...props }) => (
  <LinkContainer to={`/admin/users/roles/${name}/edit`}>
    <Button type="primary" icon={<EditIcon />} {...props}>
      {i18n.__('Roles.edit_role')}
    </Button>
  </LinkContainer>
);

EditRoleButton.propTypes = {
  name: PropTypes.string.isRequired,
};

export default EditRoleButton;
