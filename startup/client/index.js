/* eslint-disable no-underscore-dangle, no-unused-expressions */

import React from 'react';
import { hydrate, render } from 'react-dom';
import { BrowserRouter, Switch } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2';
import { ThemeProvider } from 'styled-components';
// import { ApolloProvider } from 'react-apollo';
import { ApolloProvider } from '@apollo/react-hooks';

// import i18n from 'meteor/universe:i18n';


import ConfigProvider from 'antd/lib/config-provider';
import enUS from 'antd/lib/locale-provider/en_US';

// import 'antd/dist/antd.min.css'; // pulling it from the cdn instead

import App from '../../ui/layouts/App';
import apolloClient from './apollo';
import GlobalStyle from '../../ui/layouts/GlobalStyle';

import '../../i18n';

// i18n.setLocale('en-US');


console.log(SimpleSchema2Bridge);

Accounts.onLogout(() => apolloClient.resetStore());

Meteor.startup(() => {
  const target = document.getElementById('react-root');
  const app = (
    <ConfigProvider locale={enUS}>
      <ThemeProvider theme={{}}>
        <ApolloProvider client={apolloClient}>
          <GlobalStyle />
          <BrowserRouter>
            <Switch>
              <App />
            </Switch>
          </BrowserRouter>
        </ApolloProvider>
      </ThemeProvider>
    </ConfigProvider>
  );

  return !window.noSSR ? hydrate(app, target) : render(app, target);
});
