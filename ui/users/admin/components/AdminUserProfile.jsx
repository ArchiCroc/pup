import React from 'react';
import PropTypes from 'prop-types';
import AutoForm from 'uniforms/AutoForm';
import AutoField from 'uniforms-antd/AutoField';
import SelectField from 'uniforms-antd/SelectField';

import i18n from 'meteor/universe:i18n';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Button from 'antd/lib/button';

// import { capitalize } from 'lodash';
import AdminPasswordField from './AdminPasswordField';
import AdminUserProfileSchema from '../../../../api/Users/schemas/admin-profile';

class AdminUserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
  }

  handleSubmit = (form) => {
    const existingUser = this.props.user;
    const isPasswordUser = existingUser && !existingUser.oAuthProvider;

    const cleanForm = AdminUserProfileSchema.clean(form);
    console.log('sve form', cleanForm);

    const password = isPasswordUser ? cleanForm.password : null;
    const roleCheckboxes = document.querySelectorAll('[name="role"]:checked');
    const roles = [];
    [].forEach.call(roleCheckboxes, (role) => {
      roles.push(role.value);
    });

    let user;

    if (isPasswordUser) {
      user = {
        email: cleanForm.emailAddress,
        password,
        profile: {
          name: {
            first: cleanForm.firstName,
            last: cleanForm.lastName,
          },
        },
        roles,
      };
    }

    if (!isPasswordUser) {
      user = {
        roles,
      };
    }

    if (existingUser) {
      user._id = existingUser._id;
    }

    this.props.updateUser({ variables: { user } }, () =>
      this.formRef.current.change('password', ''),
    );
  };

  handleDeleteUser = () => {
    if (confirm("Are you sure? This will permanently delete this user's account!")) {
      this.props.removeUser({
        variables: {
          _id: this.props.user._id,
        },
      });
    }
  };

  render() {
    const { user } = this.props;

    const model = user
      ? {
          firstName: user.name.first,
          lastName: user.name.last,
          username: user.username,
          emailAddress: user.emailAddress,
        }
      : {};

    return (
      <div className="AdminUserProfile">
        <AutoForm
          schema={AdminUserProfileSchema}
          model={model}
          onSubmit={this.handleSubmit}
          ref={this.formRef}
          showInlineError
          placeholder
        >
          {user && (
            <Row>
              <Col xs={24} md={16} lg={12}>
                {user &&
                  user.name && (
                    <Row gutter={25}>
                      <Col xs={12}>
                        <AutoField name="firstName" placeholder={i18n.__('Users.first_name')} />
                      </Col>
                      <Col xs={12}>
                        <AutoField name="lastName" placeholder={i18n.__('Users.last_name')} />
                      </Col>
                    </Row>
                  )}
                {user &&
                  user.username && (
                    <Row>
                      <Col xs={24}>
                        <AutoField
                          name="emailAddress"
                          disabled={user && user.oAuthProvider}
                          placeholder={i18n.__('Users.email_address')}
                        />
                      </Col>
                    </Row>
                  )}
                <Row>
                  <Col xs={24}>
                    <AutoField name="emailAddress" placeholder={i18n.__('Users.email_address')} />
                  </Col>
                </Row>
                <Row>
                  <Col xs={24}>
                    <SelectField
                      transform={(value) => value}
                      name="roles"
                      options={[
                        { label: 'User', value: 'user' },
                        { label: 'Admin', value: 'admin' },
                      ]}
                      checkboxes
                    />
                    {/* <FormGroup>
                      <ControlLabel>Roles</ControlLabel>
                      <ListGroup>
                        {user.roles.map(({ _id, name, inRole }) => (
                          <ListGroupItem key={_id}>
                            <Checkbox name="role" value={name} defaultChecked={inRole} inline>
                              {capitalize(name)}
                            </Checkbox>
                          </ListGroupItem>
                        ))}
                      </ListGroup>
                    </FormGroup> */}
                  </Col>
                </Row>
                {user &&
                  !user.oAuthProvider && (
                    <Row>
                      <Col xs={24}>
                        <AdminPasswordField
                          name="password"
                          placeholder={i18n.__('Users.password')}
                        />
                      </Col>
                    </Row>
                  )}
                <Button htmlType="submit" type="primary">
                  {i18n.__(user ? 'Users.save' : 'Users.create_user')}
                </Button>
                {user && (
                  <Button type="danger" className="pull-right" onClick={this.handleDeleteUser}>
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
}

AdminUserProfile.propTypes = {
  user: PropTypes.object.isRequired,
  updateUser: PropTypes.func.isRequired,
  removeUser: PropTypes.func.isRequired,
};

export default AdminUserProfile;
