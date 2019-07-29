import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import { useMutation } from '@apollo/react-hooks';
import AutoForm from 'uniforms-antd/AutoForm';
import SubmitField from 'uniforms-antd/SubmitField';
import message from 'antd/lib/message';
import UserSettingsSchema from '../../../api/Users/schemas/user-settings';
import StyledUserSettings from './StyledUserSettings';
import { user as userQuery } from '../queries/Users.gql';

import { updateUserSettings as updateUserSettingsMutation } from '../mutations/Users.gql';

function renderSubmitButton() {
  return <SubmitField value={i18n.__('Users.user_settings_submit')} />;
}

const UserSettings = ({ settings, userId }) => {
  const [updateUserSettings] = useMutation(updateUserSettingsMutation, {
    onCompleted: () => {
      message.success(i18n.__('Users.user_settings_save_success'));
    },
    onError: (error) => {
      message.error(error.message);
    },
    refetchQueries: [{ query: userQuery, variables: { _id: userId } }],
  });

  function handleSubmit(doc) {
    const cleanDoc = UserSettingsSchema.clean(doc);
    updateUserSettings({
      variables: {
        _id: userId,
        settings: cleanDoc,
      },
    });
  }

  return (
    <StyledUserSettings className="UserSettings">
      <AutoForm
        model={settings}
        schema={UserSettingsSchema}
        onSubmit={handleSubmit}
        autosave
        autosaveDelay={250}
        showInlineError
        placeholder
        submitField={renderSubmitButton}
      />
    </StyledUserSettings>
  );
};

UserSettings.defaultProps = {
  userId: null,
  isAdmin: false,
  settings: {},
  // updateUser: null,
};

UserSettings.propTypes = {
  userId: PropTypes.string,
  isAdmin: PropTypes.bool,
  settings: PropTypes.object,
  // updateUser: PropTypes.func,
};

export default UserSettings;
