import React from 'react';
import PropTypes from 'prop-types';
// import { Modal } from 'react-bootstrap';
import i18n from 'meteor/universe:i18n';
import modal from 'antd/lib/modal';
// import Button from 'antd/lib/button';
// import { compose, graphql } from 'react-apollo';
import UserSettings from './UserSettings';
import { userSettings as userSettingsQuery } from '../queries/Users.gql';
import { updateUser as updateUserMutation } from '../mutations/Users.gql';
import unfreezeApolloCacheValue from '../../../libs/unfreezeApolloCacheValue';
// import Styles from './StyledGDPRConsentModal';

class GDPRConsentModal extends React.Component {
  state = { show: false };

  // UNSAFE_componentWillReceiveProps(nextProps) {
  //   if (nextProps.data && nextProps.data.user && nextProps.data.user.settings) {
  //     let gdprComplete = true;
  //     const gdprSettings = nextProps.data.user.settings.filter(
  //       (setting) => setting.isGDPR === true,
  //     );
  //     gdprSettings.forEach(({ lastUpdatedByUser }) => {
  //       if (!lastUpdatedByUser) gdprComplete = false;
  //     });
  //     this.setState({ show: !gdprComplete });
  //   }
  // }

  // handleSaveSettings = () => {
  //   const { data } = this.props;
  //   if (data && data.user && data.user.settings) {
  //     this.props.updateUser({
  //       variables: {
  //         user: {
  //           settings: unfreezeApolloCacheValue(data && data.user && data.user.settings).map(
  //             (setting) => {
  //               const settingToUpdate = setting;
  //               settingToUpdate.lastUpdatedByUser = new Date().toISOString();
  //               return settingToUpdate;
  //             },
  //           ),
  //         },
  //       },
  //       refetchQueries: [{ query: userSettingsQuery }],
  //     });
  //   }
  // };

  // componentDidMount() {
  //   if (this.state.show) {
  //     modal.info({
  //       title: i18n.__('gdpr_consent_header'),
  //       content: this.renderModal(),
  //       onOk: () => {
  //         this.handleSaveSettings();
  //         this.setState({ show: false });
  //       },
  //     });
  //   }
  // }

  // renderModal() {
  //   const { data, updateUser } = this.props;
  //   return (
  //     <React.Fragment>
  //       <p>
  //         In cooperation with the European Union&apos;s (EU){' '}
  //         <a href="https://www.eugdpr.org/" target="_blank" rel="noopener noreferrer">
  //           General Data Protection Regulation
  //         </a>{' '}
  //         (GDPR), we need to obtain your consent for how we make use of your data. Please review
  //         each of the settings below to customize your experience.
  //       </p>
  //       <UserSettings settings={data.user && data.user.settings} updateUser={updateUser} />
  //     </React.Fragment>
  //   );
  // }

  render() {
    console.log('gdpr needs to updated');

    return <div className="GDPRConsentModal" />;
  }
}

// GDPRConsentModal.propTypes = {
//   data: PropTypes.object.isRequired,
//   updateUser: PropTypes.func.isRequired,
// };

export default GDPRConsentModal;

// export default compose(
//   graphql(userSettingsQuery),
//   graphql(updateUserMutation, {
//     name: 'updateUser',
//   }),
// )(GDPRConsentModal);
