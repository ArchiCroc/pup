import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import i18n from 'meteor/universe:i18n';
import { Helmet } from 'react-helmet';

const PageTitle = ({ title }) => (
  <Helmet>
    <title>
      {title} | {i18n.__('product_name')}
    </title>
  </Helmet>
);

PageTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

export default PageTitle;
