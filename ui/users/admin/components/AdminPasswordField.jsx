import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import Button from 'antd/lib/button';
// import Checkbox from 'antd/lib/checkbox';
import Input from 'antd/lib/input';
// import { capitalize } from 'lodash';
import { Random } from 'meteor/random';
// import InputHint from '../InputHint';

// import classnames from 'classnames';

import connectField from 'uniforms/connectField';
// import ErrorField from 'uniforms-antd/ErrorField';
import wrapField from 'uniforms-antd/wrapField';

// import Icon from '../../components/Icon';

class AdminPasswordField extends React.Component {
  /* constructor(props) {
    super(props);
    this.state = { showPassword: false, password: props.value };

    // this.state.showPassword = false;
    // this.state.error = error;
    // this.state.errorMessage = errorMessage;

    // this.handleChange = this.handleChange.bind(this);
  } */
  // state = { showPassword: false };

  generatePassword = () => {
    this.props.onChange(Random.hexString(20));
    // this.setState({ password: Random.hexString(20) });
  };

  // toggleShowPassword = () => {
  //   this.setState({
  //     showPassword: !this.state.showPassword,
  //   });
  // };

  renderButton() {
    return (
      <Button onClick={this.generatePassword} icon="redo" type="primary">
        {/* <Icon iconStyle="solid" icon="refresh" /> */}
        {i18n.__('Users.generate')}
      </Button>
    );
  }

  render() {
    const { props } = this;

    // const label = (
    //   <React.Fragment>
    //     {props.label}
    //     <Checkbox
    //       inline
    //       checked={this.state.showPassword}
    //       className="pull-right"
    //       onChange={this.toggleShowPassword}
    //     >
    //       {i18n.__('show_password')}
    //     </Checkbox>
    //   </React.Fragment>
    // );

    return wrapField(
      this.props,
      //  { ...this.props, label },

      <Input.Password
        //  type={this.state.showPassword ? 'text' : 'password'}
        // className={classnames(props.inputClassName, 'form-control', {
        //   'form-control-danger': props.error,
        // })}
        disabled={props.disabled}
        id={props.id}
        name={props.name}
        onChange={(event) => props.onChange(event.target.value)}
        placeholder={props.placeholder}
        ref={props.inputRef}
        value={props.value}
        addonAfter={this.renderButton()}
        className="admin-password-field"
      />,
    );
  }
}

AdminPasswordField.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
};
AdminPasswordField.defaultProps = {
  label: '',
  id: undefined,
  value: '',
};

export default connectField(AdminPasswordField);
