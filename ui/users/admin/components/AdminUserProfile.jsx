import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import { useMutation } from '@apollo/client';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Button from 'antd/lib/button';
import message from 'antd/lib/message';

import { TextField } from 'uniforms-antd';
import AutoForm from '../../../components/AutoForm';
import AdminPasswordField from './AdminPasswordField';
import CrossReferenceSelectField from '../../../components/CrossReferenceSelectField';
import AdminUserProfileSchema from '../../../../api/Users/schemas/admin-profile';

import { user as userQuery, users as usersQuery } from '../../queries/Users.gql';
import {
  updateUser as updateUserMutation,
  removeUser as removeUserMutation,
} from '../../mutations/Users.gql';

function AdminUserProfile({ user }) {
  const formRef = useRef();

  const [updateUser] = useMutation(updateUserMutation, {
    onCompleted: () => {
      message.success(i18n.__('Users.admin_user_updated'));
    },
    refetchQueries: [{ query: userQuery, variables: { _id: user._id } }],
  });
  const [removeUser] = useMutation(removeUserMutation, {
    onCompleted: () => {
      message.success(i18n.__('Users.admin_user_removed'));
      history.push('/admin/users');
    },
    refetchQueries: [{ query: usersQuery }],
  });

  function handleSubmit(form) {
    const isPasswordUser = user && !user.oAuthProvider;

    const cleanForm = AdminUserProfileSchema.clean(form);

    const password = isPasswordUser ? cleanForm.password : null;

    let cleanDoc;

    if (isPasswordUser) {
      cleanDoc = {
        email: cleanForm.emailAddress,
        password,
        profile: {
          firstName: cleanForm.firstName,
          lastName: cleanForm.lastName,
        },

        roles: cleanForm.roles,
      };
    }

    if (!isPasswordUser) {
      cleanDoc = {
        roles: cleanForm.roles,
      };
    }

    if (user) {
      cleanDoc._id = user._id;
    }

    updateUser({ variables: { user: cleanDoc } }, () => formRef.current.change('password', ''));
  }

  function handleDeleteUser() {
    if (confirm("Are you sure? This will permanently delete this user's account!")) {
      removeUser({
        variables: {
          _id: user._id,
        },
      });
    }
  }

  const model = user
    ? {
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        username: user.username,
        emailAddress: user.emailAddress,
        roles: user.roles,
      }
    : {};

  return (
    <div className="AdminUserProfile">
      <AutoForm
        schema={AdminUserProfileSchema}
        model={model}
        onSubmit={handleSubmit}
        formRef={formRef}
      >
        {user && (
          <Row>
            <Col xs={24} md={16} lg={12}>
              {user && user.profile && (
                <Row gutter={25}>
                  <Col xs={12}>
                    <TextField name="firstName" placeholder={i18n.__('Users.first_name')} />
                  </Col>
                  <Col xs={12}>
                    <TextField name="lastName" placeholder={i18n.__('Users.last_name')} />
                  </Col>
                </Row>
              )}
              {user && user.username && (
                <Row>
                  <Col xs={24}>
                    <TextField
                      name="emailAddress"
                      disabled={user && user.oAuthProvider}
                      placeholder={i18n.__('Users.email_address')}
                    />
                  </Col>
                </Row>
              )}
              <Row>
                <Col xs={24}>
                  <TextField name="emailAddress" placeholder={i18n.__('Users.email_address')} />
                </Col>
              </Row>
              <Row>
                <Col xs={24}>
                  <CrossReferenceSelectField
                    transform={(value) => value}
                    name="roles"
                    options={[
                      { label: 'User', value: 'user' },
                      { label: 'Admin', value: 'admin' },
                    ]}
                    checkboxes
                  />
                </Col>
              </Row>
              {user && !user.oAuthProvider && (
                <Row>
                  <Col xs={24}>
                    <AdminPasswordField name="password" placeholder={i18n.__('Users.password')} />
                  </Col>
                </Row>
              )}
              <Button htmlType="submit" type="primary">
                {i18n.__(user ? 'Users.save' : 'Users.create_user')}
              </Button>
              {user && (
                <Button type="danger" className="pull-right" onClick={handleDeleteUser}>
                  {i18n.__('Users.delete_user')}
                </Button>
              )}
            </Col>
          </Row>
        )}
      </AutoForm>
    </div>
  );
}

AdminUserProfile.propTypes = {
  user: PropTypes.object.isRequired,
};

export default AdminUserProfile;
