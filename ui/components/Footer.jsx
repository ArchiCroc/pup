import React from 'react';
import { Meteor } from 'meteor/meteor';
import i18n from 'meteor/universe:i18n';
import { Link } from 'react-router-dom';

import { year } from '../../libs/dates';
import StyledFooter from './StyledFooter';

const copyrightYear = () => {
  const copyrightStartYear = i18n.__('copyright_start_year');
  const currentYear = year();
  return currentYear === copyrightStartYear
    ? copyrightStartYear
    : `${copyrightStartYear}-${currentYear}`;
};

const Footer = () => (
  <StyledFooter>
    <p className="pull-left">
      {i18n.__('footer', { copyrightYear: copyrightYear(), productName: i18n.__('product_name') })}
    </p>
    <ul className="pull-right">
      <li>
        <Link to="/terms">
          {i18n.__('terms_of_service')}
          <span className="hidden-xs">{i18n.__('terms_of_service_hidden')}</span>
        </Link>
      </li>
      <li>
        <Link to="/privacy">
          {i18n.__('privacy_policy')}

          <span className="hidden-xs">{i18n.__('privacy_policy_hidden')}</span>
        </Link>
      </li>
    </ul>
  </StyledFooter>
);

Footer.propTypes = {};

export default Footer;
