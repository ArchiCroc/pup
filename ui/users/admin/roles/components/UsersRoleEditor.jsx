/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import { useMutation } from '@apollo/client';
import Button from 'antd/lib/button';
import message from 'antd/lib/message';
import { useHistory } from 'react-router-dom';
import { HiddenField, TextField } from 'uniforms-antd';
import AutoForm from '../../../../components/AutoForm';

/* #### PLOP_IMPORTS_START #### */
/* #### PLOP_IMPORTS_END #### */

import { usersRoles as usersRolesQuery } from '../queries/UsersRoles.gql';
import { saveUsersRole as saveUsersRoleMutation } from '../mutations/UsersRoles.gql';

import UsersRoleSchema from '../../../../../api/Users/Roles/schemas/users-role';

import StyledUsersRoleEditor from './StyledUsersRoleEditor';

function UsersRoleEditor({ doc }) {
  const history = useHistory();

  const [saveUsersRole] = useMutation(saveUsersRoleMutation, {
    ignoreResults: true,
    onCompleted: () => {
      message.success(i18n.__('UsersRoles.role_saved'));
      history.push('/admin/users/roles');
    },
    onError: (error) => {
      message.error(error.message);
    },
    refetchQueries: [{ query: usersRolesQuery }],
  });

  function handleSubmit(form) {
    const cleanForm = UsersRoleSchema.clean(form);
    // console.log('cleanForm', cleanForm);
    saveUsersRole({
      variables: { usersRole: cleanForm },
    });
  }

  // fix issue with uniforms getting a null for visionNames
  if (doc && !doc.visionNames) {
    doc.visionNames = []; //eslint-disable-line
  }

  return (
    <StyledUsersRoleEditor>
      <AutoForm name="usersRole" schema={UsersRoleSchema} onSubmit={handleSubmit} model={doc}>
        <HiddenField name="_id" />
        <TextField name="name" />
        <Button htmlType="submit" type="primary" block>
          {i18n.__('UsersRoles.save')}
        </Button>
      </AutoForm>
    </StyledUsersRoleEditor>
  );
}

UsersRoleEditor.defaultProps = {
  doc: {},
};

UsersRoleEditor.propTypes = {
  doc: PropTypes.object,
};

export default UsersRoleEditor;
