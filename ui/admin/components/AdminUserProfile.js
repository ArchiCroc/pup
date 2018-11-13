import React from 'react';
import PropTypes from 'prop-types';
import AutoForm from 'uniforms/AutoForm';
import AutoField from 'uniforms-bootstrap3/AutoField';
import i18n from 'meteor/universe:i18n';
import {
  Row,
  Col,
  ControlLabel,
  FormGroup,
  ListGroup,
  ListGroupItem,
  Checkbox,
  //  InputGroup,
  Button,
} from 'react-bootstrap';
import { capitalize } from 'lodash';
import AdminPasswordField from './AdminPasswordField';
import AdminProfileSchema from '../../../api/Users/schemas/admin-profile';

class AdminUserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
  }

  handleSubmit = (form) => {
    const existingUser = this.props.user;
    const isPasswordUser = existingUser && !existingUser.oAuthProvider;

    const cleanForm = AdminProfileSchema.clean(form);
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
          schema={AdminProfileSchema}
          model={model}
          onSubmit={this.handleSubmit}
          ref={this.formRef}
          showInlineError
          placeholder
        >
          {user && (
            <Row>
              <Col xs={12} md={6}>
                {user &&
                  user.name && (
                    <Row>
                      <Col xs={6}>
                        <AutoField name="firstName" placeholder={i18n.__('first_name')} />
                      </Col>
                      <Col xs={6}>
                        <AutoField name="lastName" placeholder={i18n.__('last_name')} />
                      </Col>
                    </Row>
                  )}
                {user &&
                  user.username && (
                    <Row>
                      <Col xs={12}>
                        <AutoField
                          name="emailAddress"
                          disabled={user && user.oAuthProvider}
                          placeholder={i18n.__('email_address')}
                        />
                      </Col>
                    </Row>
                  )}
                <Row>
                  <Col xs={12}>
                    <AutoField name="emailAddress" placeholder={i18n.__('email_address')} />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <FormGroup>
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
                    </FormGroup>
                  </Col>
                </Row>
                {user &&
                  !user.oAuthProvider && (
                    <Row>
                      <Col xs={12}>
                        <AdminPasswordField name="password" placeholder={i18n.__('password')} />
                      </Col>
                    </Row>
                  )}
                <Button type="submit" bsStyle="success">
                  {user ? 'Save Changes' : 'Create User'}
                </Button>
                {user && (
                  <Button bsStyle="danger" className="pull-right" onClick={this.handleDeleteUser}>
                    Delete User
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
