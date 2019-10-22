import React from 'react';
import { Meteor } from 'meteor/meteor';
import i18n from 'meteor/universe:i18n';

import appEnI18n from './en/app.en.i18n.yml';
import usersEnI18n from './en/users.en.i18n.yml';

/* #### PLOP_IMPORTS_START #### */
import errorReportsEnI18n from './en/errorReports.en.i18n.yml';
/* #### PLOP_IMPORTS_END #### */

// workaround since the meteor loader skips them
i18n.setOptions({
  open: '${',
  hostUrl: Meteor.absoluteUrl('/'),
  defaultLocale: 'en-US',
});
// i18n.addTranslations('en-us', appEnI18n);
// i18n.addTranslations('en-us', Object.assign({}, appEnI18n, usersEnI18n));
// i18n.addTranslations('en-us', Object.assign({}, appEnI18n, documentsEnI18n));
i18n.setLocale('en-US');

// add a helper to allow html to render from the translation file
// @todo make sure arguments are being properly escaped

i18n.___ = function translateUnsafe(...args) {
  if (args.length > 1) {
    const lastItem = args[args.length - 1];
    if (typeof lastItem === 'object') {
      lastItem._purify = false; // eslint-disable-line
    } else {
      args.push({ _purify: false });
    }
  } else {
    args.push({ _purify: false });
  }
  // eslint-disable-next-line
  return <span dangerouslySetInnerHTML={{ __html: i18n.__(...args) }} />;
};
