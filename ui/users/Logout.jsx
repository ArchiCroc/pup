import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import i18n from 'meteor/universe:i18n';
import Icon from 'antd/lib/icon';

import StyledLogout from './StyledLogout';

function Logout(props) {
  useEffect(() => {
    Meteor.logout(() => props.setAfterLoginPath(null));
  });

  const productName = i18n.__('product_name');
  const facebookUsername = i18n.__('facebook_username');
  const twitterUsername = i18n.__('twitter_username');

  return (
    <StyledLogout>
      <img
        src="https://s3-us-west-2.amazonaws.com/cleverbeagle-assets/graphics/email-icon.png"
        alt="Clever Beagle"
      />
      <h1>{i18n.__('Users.logout_title')}</h1>
      <p>{i18n.__('Users.logout_message', { productName })}</p>
      <ul className="FollowUsElsewhere">
        <li>
          <a
            href={`https://facebook.com/${facebookUsername}?utm_source=app&utm_medium=referral&utm_campaign=logoutPage`}
          >
            <Icon type="facebook" />
          </a>
        </li>
        <li>
          <a
            href={`https://twitter.com/${twitterUsername}?utm_source=app&utm_medium=referral&utm_campaign=logoutPage`}
          >
            <Icon type="twitter" />
          </a>
        </li>
      </ul>
    </StyledLogout>
  );
}

Logout.propTypes = {
  setAfterLoginPath: PropTypes.func.isRequired,
};

export default Logout;
