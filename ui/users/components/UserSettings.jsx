import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import List from 'antd/lib/list';
import Switch from 'antd/lib/switch';
import BlankState from '../../components/BlankState';
import unfreezeApolloCacheValue from '../../../modules/unfreezeApolloCacheValue';
import delay from '../../../modules/delay';
import StyledUserSettings from './StyledUserSettings';

class UserSettings extends React.Component {
  state = { settings: unfreezeApolloCacheValue([...this.props.settings]) };

  handleUpdateSetting = (setting) => {
    const settings = [...this.state.settings];
    const settingToUpdate = settings.find(({ _id }) => _id === setting._id);
    settingToUpdate.value = setting.value;

    if (!this.props.userId) settingToUpdate.lastUpdatedByUser = new Date().toISOString();

    this.setState({ settings }, () => {
      delay(() => {
        this.props.updateUser({
          variables: {
            user: {
              _id: this.props.userId,
              settings,
            },
          },
        });
      }, 750);
    });
  };

  renderSettingValue = (type, key, value, onChange) =>
    ({
      boolean: () => (
        <Switch
          id={key}
          checked={value === 'true'}
          onChange={(toggled) => onChange({ key, value: `${toggled}` })}
        />
      ),
      number: () => (
        <input
          type="number"
          className="form-control"
          value={value}
          onChange={(event) => onChange({ key, value: parseInt(event.target.value, 10) })}
        />
      ),
      string: () => (
        <input
          type="text"
          className="form-control"
          value={value}
          onChange={(event) => onChange({ key, value: event.target.value })}
        />
      ),
    }[type]());

  renderItem = ({ _id, key, label, type, value }) => (
    <List.Item key={key} className="user-settings-item">
      <p>{label}</p>
      <div style={{ float: 'right' }}>
        {this.renderSettingValue(type, key, value, (update) =>
          this.handleUpdateSetting({ ...update, _id }),
        )}
      </div>
    </List.Item>
  );

  render() {
    const { settings } = this.state;
    return (
      <StyledUserSettings className="UserSettings">
        {settings.length > 0 ? (
          <List bordered dataSource={settings} renderItem={this.renderItem} />
        ) : (
          <BlankState
            icon={{ style: 'solid', symbol: 'cogs' }}
            title={i18n.__(`Users.${this.props.isAdmin ? 'admin_' : ''}user_settings_blank_title`)}
            subtitle={i18n.__(
              `Users.${this.props.isAdmin ? 'admin_' : ''}user_settings_blank_subtitle`,
            )}
          />
        )}
      </StyledUserSettings>
    );
  }
}

UserSettings.defaultProps = {
  userId: null,
  isAdmin: false,
  settings: [],
  updateUser: null,
};

UserSettings.propTypes = {
  userId: PropTypes.string,
  isAdmin: PropTypes.bool,
  settings: PropTypes.array,
  updateUser: PropTypes.func,
};

export default UserSettings;
