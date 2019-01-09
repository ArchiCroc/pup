import i18n from 'meteor/universe:i18n';

import appEnI18n from './en/app.en.i18n.yml';
import usersEnI18n from './en/users.en.i18n.yml';
import documentsEnI18n from './en/documents.en.i18n.yml';

// workaround since the meteor loader skips them
i18n.setOptions({ open: '${' });
i18n.addTranslations('en-us', appEnI18n);
i18n.addTranslations('en-us', Object.assign({}, appEnI18n, usersEnI18n));
i18n.addTranslations('en-us', Object.assign({}, appEnI18n, documentsEnI18n));
i18n.setLocale('en-US');
