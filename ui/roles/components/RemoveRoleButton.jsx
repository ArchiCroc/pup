import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import i18n from 'meteor/universe:i18n';
import Button from 'antd/lib/button';
import modal from 'antd/lib/modal';
import message from 'antd/lib/message';

import { roles as rolesQuery } from '../queries/Roles.gql';
import { removeRole as removeRoleMutation } from '../mutations/Roles.gql';

function RemoveRoleButton({ _id, name, ...props }) {
  const history = useHistory();
  const [removeRole] = useMutation(removeRoleMutation, {
    ignoreResults: true,
    onCompleted: () => {
      message.success(i18n.__('Roles.role_saved'));
      history.push('/admin/users/roles');
    },
    onError: (error) => {
      message.error(error.message);
    },
    refetchQueries: [{ query: rolesQuery }],
    variables: { _id },
  });

  function showConfirmModal() {
    modal.confirm({
      title: i18n.___('Roles.confirm_remove_role', { name }),
      onOk: removeRole,
      okText: i18n.__('Roles.remove'),
      okType: 'danger',
      cancelText: i18n.__('Roles.cancel'),
    });
  }

  return (
    <Button
      key={_id}
      type="danger"
      onClick={showConfirmModal}
      {...props}
    >
      {i18n.__('Roles.remove_role')}
    </Button>
  );
}

RemoveRoleButton.propTypes = {
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default RemoveRoleButton;
