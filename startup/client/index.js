/* eslint-disable no-underscore-dangle, no-unused-expressions */

import React from 'react';
import i18n from 'meteor/universe:i18n';
import { hydrate } from 'react-dom';
import { BrowserRouter, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { ApolloProvider } from 'react-apollo';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';

import App from '../../ui/layouts/App';
import apolloClient from './apollo';
import GlobalStyle from './GlobalStyle';
import usersEnI18n from '../../i18n/en/users.en.i18n.json';

Bert.defaults.style = 'growl-bottom-right';

// workaround since the meteor loader skips them
i18n.addTranslations('en-us', usersEnI18n);

i18n.setLocale('en-US');

Accounts.onLogout(() => apolloClient.resetStore());

Meteor.startup(() =>
  hydrate(
    <ThemeProvider theme={{}}>
      <ApolloProvider client={apolloClient}>
        <GlobalStyle />
        <BrowserRouter>
          <Switch>
            <App />
          </Switch>
        </BrowserRouter>
      </ApolloProvider>
    </ThemeProvider>,
    document.getElementById('react-root'),
  ),
);
