import React, { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import i18n from 'meteor/universe:i18n';
import { useMutation } from '@apollo/client';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Button from 'antd/lib/button';
import message from 'antd/lib/message';

import { TextField } from 'uniforms-antd';
import AutoForm from '/imports/ui/components/AutoForm';
import AdminPasswordField from './AdminPasswordField';
import CrossReferenceSelectField from '/imports/ui/components/CrossReferenceSelectField';
import AdminUserProfileSchema from '/imports/common/Users/schemas/admin-profile';
import { User, UserInput } from '/imports/common/Users/interfaces';

import { USER_QUERY, USERS_QUERY } from '../../graphql/queries.gql';
import {
  UPDATE_USER_MUTATION,
  REMOVE_USER_MUTATION,
} from '../../graphql/mutations.gql';


interface AdminUserProfileProps {
  user: User;
};


function AdminUserProfile({ user }: AdminUserProfileProps) {
  const formRef = useRef<HTMLFormElement>();
  const history = useHistory();

  const [updateUser] = useMutation(UPDATE_USER_MUTATION, {
    onCompleted: () => {
      message.success(i18n.__('Users.admin_user_updated'));
    },
    refetchQueries: [{ query: USER_QUERY, variables: { _id: user._id } }],
  });
  const [removeUser] = useMutation(REMOVE_USER_MUTATION, {
    onCompleted: () => {
      formRef?.current?.change('password', '')
      message.success(i18n.__('Users.admin_user_removed'));
      history.push('/admin/users');
    },
    refetchQueries: [{ query: USERS_QUERY }],
  });

  function handleSubmit(model: object) {
    const isPasswordUser = user && !user.oAuthProvider;

    const cleanForm = AdminUserProfileSchema.clean(model);

    const password = isPasswordUser ? cleanForm.password : null;

    let cleanDoc: UserInput;

    if (isPasswordUser) {
      cleanDoc = {
        emailAddress: cleanForm.emailAddress,
        password,
        profile: {
          firstName: cleanForm.firstName,
          lastName: cleanForm.lastName,
        },

        roles: cleanForm.roles,
      };
    } else {
      cleanDoc = {
        roles: cleanForm.roles,
      };
    }

    if (user) {
      cleanDoc._id = user._id;
    }

    updateUser({ variables: { user: cleanDoc } });


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
      firstName: user?.profile?.firstName,
      lastName: user?.profile?.lastName,
      username: user.username,
      emailAddress: user.emailAddress,
      roles: user.roles,
    }
    : {};

  return (
    <div className="AdminUserProfile">
      <AutoForm
        name="admin-user-profile"
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
                    <TextField name="firstName" />
                  </Col>
                  <Col xs={12}>
                    <TextField name="lastName" />
                  </Col>
                </Row>
              )}
              {user && user.username && (
                <Row>
                  <Col xs={24}>
                    <TextField
                      name="emailAddress"
                      disabled={!!(user && user.oAuthProvider)}
                    />
                  </Col>
                </Row>
              )}
              <Row>
                <Col xs={24}>
                  <TextField name="emailAddress" />
                </Col>
              </Row>
              <Row>
                <Col xs={24}>
                  <CrossReferenceSelectField
                    transform={(value: any) => value}
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
                    <AdminPasswordField name="password" />
                  </Col>
                </Row>
              )}
              <Button htmlType="submit" type="primary">
                {i18n.__(user ? 'Users.save' : 'Users.create_user')}
              </Button>
              {user && (
                <Button danger className="pull-right" onClick={handleDeleteUser}>
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

export default AdminUserProfile;
