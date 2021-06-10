import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import { Meteor } from 'meteor/meteor';
import PageHeader from '/imports/ui/components/PageHeader';
import StyledPage from './StyledPage';

const Page = ({ title, subtitle, content }) => {
  if (Meteor.isClient) window.scrollTo(0, 0); // Force window to top of page.
  return (
    <StyledPage>
      <PageHeader title={title} subtitle={subtitle} />
      <ReactMarkdown source={content} />
    </StyledPage>
  );
};

Page.defaultProps = {
  subtitle: '',
};

Page.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  content: PropTypes.string.isRequired,
};

export default Page;
