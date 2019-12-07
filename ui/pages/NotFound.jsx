import React from 'react';
import { Meteor } from 'meteor/meteor';
import i18n from 'meteor/universe:i18n';
import Alert from 'antd/lib/alert';
import PageWrapper from '../components/PageWrapper';

const NotFound = () => (
  <PageWrapper className="NotFound">
    <Alert
      type="danger"
      message={i18n.__('page_not_found_title')}
      description={i18n.__('page_not_found_message', {
        page: Meteor.isClient ? window.location.pathname : '',
      })}
    />
  </PageWrapper>
);

export default NotFound;
