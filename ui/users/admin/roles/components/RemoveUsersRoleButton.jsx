import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import { useMutation } from '@apollo/client';
import Button from 'antd/lib/button';
import message from 'antd/lib/message';
import modal from 'antd/lib/modal';
import { useHistory } from 'react-router-dom';

import { usersRoles as usersRolesQuery } from '../queries/UsersRoles.gql';
import { removeUsersRole as removeUsersRoleMutation } from '../mutations/UsersRoles.gql';

function RemoveUsersRoleButton({ _id, title, ...props }) {
  const history = useHistory();

  const [removeUsersRole] = useMutation(removeUsersRoleMutation, {
    ignoreResults: true,
    onCompleted: () => {
      message.success(i18n.__('UsersRoles.role_saved'));
      history.push('/admin/users/roles');
    },
    onError: (error) => {
      message.error(error.message);
    },
    refetchQueries: [{ query: usersRolesQuery }],
    variables: { _id },
  });

  function showConfirmModal() {
    modal.confirm({
      title: i18n.___('UsersRoles.confirm_remove_role', { title }),
      onOk: removeUsersRole,
      okText: i18n.__('UsersRoles.remove'),
      okType: 'danger',
      okButtonProps: { 'data-testid': 'remove-users-role-ok-button' },
      cancelText: i18n.__('UsersRoles.cancel'),
      cancelButtonProps: { 'data-testid': 'remove-users-role-cancel-button' },
    });
  }

  return (
    <Button key={_id} type="danger" onClick={showConfirmModal} {...props}>
      {i18n.__('UsersRoles.remove_role')}
    </Button>
  );
}

RemoveUsersRoleButton.propTypes = {
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default RemoveUsersRoleButton;
