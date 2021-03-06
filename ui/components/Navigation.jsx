import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
// import { Meteor } from 'meteor/meteor';
import i18n from 'meteor/universe:i18n';
import PublicNavigation from './PublicNavigation';
import AuthenticatedNavigation from './AuthenticatedNavigation';

import { StyledBrand, StyledMenu } from './StyledNavigation';

const Navigation = (props) => (
  <>
    <StyledBrand>
      <Link to="/">{i18n.__('product_name')}</Link>
    </StyledBrand>
    {!props.authenticated ? (
      <StyledMenu>
        <PublicNavigation {...props} />
      </StyledMenu>
    ) : (
      <AuthenticatedNavigation {...props} />
    )}
  </>
);

Navigation.defaultProps = {
  name: '',
};

Navigation.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  name: PropTypes.string,
};

export default Navigation;
