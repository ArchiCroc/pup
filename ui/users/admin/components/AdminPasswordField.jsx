import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import Button from 'antd/lib/button';
// import Checkbox from 'antd/lib/checkbox';
import Input from 'antd/lib/input';
import RedoIcon from '@ant-design/icons/RedoOutlined';
import { Random } from 'meteor/random';
import { connectField } from 'uniforms';
import { wrapField } from 'uniforms-antd';

// import Icon from '../../components/Icon';

function AdminPasswordField(props) {
  function generatePassword() {
    props.onChange(Random.hexString(20));
  }

  function renderButton() {
    return (
      <Button onClick={generatePassword} icon={<RedoIcon />} type="primary">
        {i18n.__('Users.generate')}
      </Button>
    );
  }

  return wrapField(
    props,
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
      addonAfter={renderButton()}
      className="admin-password-field"
    />,
  );
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
