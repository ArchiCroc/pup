import React from 'react';
import PropTypes from 'prop-types';
// import { Helmet } from 'react-helmet';
// import { Meteor } from '../pages/node_modules/meteor/meteor';

import Styled from './StyledPageHeader';
import PageTitle from './PageTitle';

const PageHeader = ({ title, subtitle, children }) => (
  <Styled.PageHeader>
    <PageTitle title={title} />
    <Styled.PageHeaderContainer>
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </Styled.PageHeaderContainer>
    {children}
  </Styled.PageHeader>
);

PageHeader.defaultProps = {
  subtitle: '',
  children: null,
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  children: PropTypes.node,
};

export default PageHeader;
