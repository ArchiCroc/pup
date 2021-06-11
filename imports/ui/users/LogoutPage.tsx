import React, { useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import i18n from 'meteor/universe:i18n';
import FacebookIcon from '@ant-design/icons/FacebookOutlined';
import TwitterIcon from '@ant-design/icons/TwitterOutlined';

import StyledLogoutPage from './StyledLogoutPage';

interface LogoutPageProps {
  setAfterLoginPath: (path: string | null) => void,
};

function LogoutPage(props: LogoutPageProps) {
  useEffect(() => {
    Meteor.logout(() => props.setAfterLoginPath(null));
  });

  const productName = i18n.__('product_name');
  const facebookUsername = i18n.__('facebook_username');
  const twitterUsername = i18n.__('twitter_username');

  return (
    <StyledLogoutPage>
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
            <FacebookIcon />
          </a>
        </li>
        <li>
          <a
            href={`https://twitter.com/${twitterUsername}?utm_source=app&utm_medium=referral&utm_campaign=logoutPage`}
          >
            <TwitterIcon />
          </a>
        </li>
      </ul>
    </StyledLogoutPage>
  );
}

export default LogoutPage;
