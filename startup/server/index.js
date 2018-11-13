import './accounts';
import './api';
import './browserPolicy';
import './fixtures';
import './email';
import './sitemap';
import './graphql';
import './ssr';

import i18n from 'meteor/universe:i18n';

import usersEnI18n from '../../i18n/en/users.en.i18n.json';

// workaround since the meteor loader skips them
i18n.addTranslations('en-us', usersEnI18n);
i18n.setLocale('en-US');
