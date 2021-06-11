import React from 'react';
import i18n from 'meteor/universe:i18n';
import { useMutation } from '@apollo/client';
import { BoolField, SubmitField } from 'uniforms-antd';
import message from 'antd/lib/message';
import AutoForm from '/imports/ui/components/AutoForm';
import UserSettingsSchema from '/imports/common/Users/schemas/user-settings';
import StyledUserSettings from './StyledUserSettings';
import { User, UserSettings } from '/imports/common/Users/interfaces';

import { USER_QUERY } from '../graphql/queries.gql';
import { UPDATE_USER_SETTINGS_MUTATION } from '../graphql/mutations.gql';


/* #### PLOP_IMPORTS_START #### */
/* #### PLOP_IMPORTS_END #### */

function renderSubmitButton() {
  return <SubmitField value={i18n.__('Users.user_settings_submit')} />;
}

interface UserSettingsProps {
  isAdmin?: boolean;
  user: User,
};

const UserSettings = ({ user, isAdmin = false }: UserSettingsProps) => {
  const [updateUserSettings] = useMutation(UPDATE_USER_SETTINGS_MUTATION, {
    onCompleted: () => {
      message.success(i18n.__('Users.user_settings_save_success'));
    },
    onError: (error) => {
      message.error(error.message);
    },
    refetchQueries: [{ query: USER_QUERY, variables: { _id: user._id } }],
  });

  function handleSubmit(doc: object) {
    const cleanDoc: UserSettings = UserSettingsSchema.clean(doc);
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
        name="user-settings"
        model={user.settings}
        schema={UserSettingsSchema}
        onSubmit={handleSubmit}
        autosave
        autosaveDelay={250}
        submitField={renderSubmitButton}
      >
        <BoolField name="gdpr.canSendMarketingEmails" />
        {/* #### PLOP_FIELDS_START #### */}
        {/* #### PLOP_FIELDS_END #### */}
      </AutoForm>
    </StyledUserSettings>
  );
};

export default UserSettings;
