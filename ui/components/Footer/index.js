import React from 'react';
import i18n from 'meteor/universe:i18n';
import { Link } from 'react-router-dom';
import { Grid } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { year } from '../../../modules/dates';
import Styles from './styles';

const { productName, copyrightStartYear } = Meteor.settings.public;
const copyrightYear = () => {
  const currentYear = year();
  return currentYear === copyrightStartYear
    ? copyrightStartYear
    : `${copyrightStartYear}-${currentYear}`;
};

const Footer = () => (
  <Styles.Footer>
    <Grid>
      <p className="pull-left">
        {i18n.__('footer', { copyrightYear: copyrightYear(), productName })}
        {console.log({ copyrightYear: copyrightYear(), productName })}
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
    </Grid>
  </Styles.Footer>
);

Footer.propTypes = {};

export default Footer;
