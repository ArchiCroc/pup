import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import { ListGroup } from 'react-bootstrap';
import ToggleSwitch from '../ToggleSwitch';
import BlankState from '../BlankState';
import unfreezeApolloCacheValue from '../../../modules/unfreezeApolloCacheValue';
import delay from '../../../modules/delay';
import Styles from './styles';

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
        <ToggleSwitch
          id={key}
          toggled={value === 'true'}
          onToggle={(id, toggled) => onChange({ key, value: `${toggled}` })}
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

  render() {
    const { settings } = this.state;
    return (
      <div className="UserSettings">
        <ListGroup>
          {settings.length > 0 ? (
            settings.map(({ _id, key, label, type, value }) => (
              <Styles.Setting key={key} className="clearfix">
                <p>{label}</p>
                <div>
                  {this.renderSettingValue(type, key, value, (update) =>
                    this.handleUpdateSetting({ ...update, _id }),
                  )}
                </div>
              </Styles.Setting>
            ))
          ) : (
            <BlankState
              icon={{ style: 'solid', symbol: 'cogs' }}
              title={i18n.__(`${this.props.isAdmin ? 'admin_' : ''}user_settings_blank_title`)}
              subtitle={i18n.__(
                `${this.props.isAdmin ? 'admin_' : ''}user_settings_blank_subtitle`,
              )}
            />
          )}
        </ListGroup>
      </div>
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
