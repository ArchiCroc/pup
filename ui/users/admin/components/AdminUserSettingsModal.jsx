import React from 'react';
import PropTypes from 'prop-types';

import AutoForm from 'uniforms/AutoForm';
import AutoField from 'uniforms-antd/AutoField';

import BoolField from 'uniforms-antd/BoolField';
import NumField from 'uniforms-antd/NumField';
import TextField from 'uniforms-antd/TextField';

// import ErrorsField from 'uniforms-antd/ErrorsField';
import i18n from 'meteor/universe:i18n';
// import Button from 'antd/lib/button';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Modal from 'antd/lib/modal';

// import { camelCase } from 'lodash';
// import Switch from 'antd/lib/switch';
// import Validation from '../../../components/Validation';
// import InputHint from '../../../components/InputHint';

// import delay from '../../../../modules/delay';

import AdminUserSettingsSchema from '../../../../api/UserSettings/schemas/user-setting';

// const defaultState = {
//   keyName: '',
//   isGDPR: false,
//   settingType: 'boolean',
//   value: '',
//   label: '',
// };

class AdminUserSettingsModal extends React.Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
  }

  state = { settingType: 'boolean' };

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.setting) {
  //     this.setState({
  //       keyName: nextProps.setting.key,
  //       isGDPR: nextProps.setting.isGDPR,
  //       settingType: nextProps.setting.type,
  //       value: nextProps.setting.value,
  //       label: nextProps.setting.label,
  //     });
  //   } else {
  //     this.setState(defaultState);
  //   }
  // }

  handleSubmit = (form) => {
    const mutation = this.props.setting ? this.props.updateUserSetting : this.props.addUserSetting;
    const cleanForm = AdminUserSettingsSchema.clean(form);
    console.log('save form', cleanForm);

    if (this.props.setting) {
      cleanForm._id = this.props.setting._id;
      const confirmUpdate = confirm(
        "Are you sure? This will overwrite this setting for all users immediately. If you're changing the Key Name or Type, double-check that your UI can support this to avoid rendering errors.",
      );
      if (!confirmUpdate) return;
    }

    mutation({
      variables: {
        cleanForm,
      },
    });

    this.props.onHide();
  };

  handleOk = () => {
    // console.log(this.formRef);
    this.formRef.current.submit();
  };

  handleCancel = () => {
    this.props.onHide();
  };

  // handleSetKeyName = (event) => {
  //   event.persist();
  //   this.setState({ keyName: event.target.value }, () => {
  //     delay(() => {
  //       this.setState({ keyName: camelCase(event.target.value.trim()) });
  //     }, 300);
  //   });
  // };

  // formRef = React.createRef();

  render() {
    const { show, onHide, setting } = this.props;
    return (
      <Modal
        visible={show}
        afterClose={onHide}
        title={`${setting ? 'Edit' : 'Add a'} User Setting`}
        onOk={this.handleOk}
        okText="Save"
        onCancel={this.handleCancel}
        //   footer={[
        //     <Button key="back" onClick={this.handleCancel}>
        //       Return
        //     </Button>,
        //     <Button key="submit" type="primary" onClick={this.handleOk}>
        //       Submit
        //     </Button>,
        //   ]}
      >
        <AutoForm
          schema={AdminUserSettingsSchema}
          model={this.props.setting || {}}
          onSubmit={this.handleSubmit}
          ref={this.formRef}
          showInlineError
          placeholder
        >
          <Row gutter={50}>
            <Col xs={24} sm={12}>
              <TextField name="key" placeholder={i18n.__('Users.key_name_placeholder')} />
            </Col>
            <Col xs={24} sm={12}>
              <BoolField name="isGDPR" />
            </Col>
          </Row>
          <TextField
            name="label"
            placeholder={i18n.__('Users.label_placeholder')}
            help={i18n.__('Users.label_help')}
          />

          <Row gutter={50}>
            <Col xs={24} sm={12}>
              <AutoField name="type" />
            </Col>
            <Col xs={24} sm={12}>
              {this.state.settingType === 'boolean' && <BoolField name="value" />}
              {this.state.settingType === 'number' && <NumField name="value" />}
              {this.state.settingType === 'string' && (
                <TextField name="value" placeholder={i18n.__('Users.value_placeholder')} />
              )}
            </Col>
          </Row>
        </AutoForm>
      </Modal>
    );
  }
}

AdminUserSettingsModal.defaultProps = {
  setting: {},
};

AdminUserSettingsModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  setting: PropTypes.object,
  addUserSetting: PropTypes.func.isRequired,
  updateUserSetting: PropTypes.func.isRequired,
};

export default AdminUserSettingsModal;
