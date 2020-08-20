import React from 'react';
import Page from './Page';
import content from './ExamplePageContent';

const ExamplePage = () => (
  <Page title="My Example Page" subtitle="A subtitle for my example page." content={content} />
);

export default ExamplePage;
