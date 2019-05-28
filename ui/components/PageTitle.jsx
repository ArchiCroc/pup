import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Meteor } from 'meteor/meteor';

const PageTitle = ({ title }) => (
  <Helmet>
    <title>
      {title} | {Meteor.settings.public.title}
    </title>
  </Helmet>
);

PageTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

export default PageTitle;
