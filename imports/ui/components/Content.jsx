/* eslint-disable react/no-danger */

import React from 'react';
import PropTypes from 'prop-types';

const Content = ({ content }) => <React.Fragment dangerouslySetInnerHTML={{ __html: content }} />;

Content.propTypes = {
  content: PropTypes.string.isRequired,
};

export default Content;
