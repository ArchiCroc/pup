import React from 'react';
import { Meteor } from 'meteor/meteor';
import i18n from 'meteor/universe:i18n';
import ItemNotFound from '/imports/ui/components/ItemNotFound';
import PageWrapper from '/imports/ui/components/PageWrapper';

const NotFoundPage = () => (
  <PageWrapper className="NotFound">
    <ItemNotFound
      title={i18n.__('page_not_found_title')}
      message={i18n.__('page_not_found_message', {
        page: Meteor.isClient ? window.location.pathname : '',
      })}
    />
  </PageWrapper>
);

export default NotFoundPage;
