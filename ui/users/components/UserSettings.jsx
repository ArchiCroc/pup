import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import { useMutation } from '@apollo/react-hooks';
import { AutoForm, BoolField, SubmitField } from 'uniforms-antd';
import message from 'antd/lib/message';
import UserSettingsSchema from '../../../api/Users/schemas/user-settings';
import StyledUserSettings from './StyledUserSettings';
import { user as userQuery } from '../queries/Users.gql';

import { updateUserSettings as updateUserSettingsMutation } from '../mutations/Users.gql';

/* #### PLOP_IMPORTS_START #### */
/* #### PLOP_IMPORTS_END #### */

function renderSubmitButton() {
  return <SubmitField value={i18n.__('Users.user_settings_submit')} />;
}

const UserSettings = ({ user }) => {
  const [updateUserSettings] = useMutation(updateUserSettingsMutation, {
    onCompleted: () => {
      message.success(i18n.__('Users.user_settings_save_success'));
    },
    onError: (error) => {
      message.error(error.message);
    },
    refetchQueries: [{ query: userQuery, variables: { _id: user._id } }],
  });

  function handleSubmit(doc) {
    const cleanDoc = UserSettingsSchema.clean(doc);
    updateUserSettings({
      variables: {
        _id: user._id,
        settings: cleanDoc,
      },
    });
  }

  return (
    <StyledUserSettings className="UserSettings">
      <AutoForm
        model={user.settings}
        schema={UserSettingsSchema}
        onSubmit={handleSubmit}
        autosave
        autosaveDelay={250}
        showInlineError
        placeholder
        submitField={renderSubmitButton}
      >
        <BoolField name="gdpr.canSendMarketingEmails" />
        {/* #### PLOP_FIELDS_START #### */}
        {/* #### PLOP_FIELDS_END #### */}
      </AutoForm>
    </StyledUserSettings>
  );
};

UserSettings.defaultProps = {
  isAdmin: false,
};

UserSettings.propTypes = {
  isAdmin: PropTypes.bool,
  user: PropTypes.object.isRequired,
  // updateUser: PropTypes.func,
};

export default UserSettings;
