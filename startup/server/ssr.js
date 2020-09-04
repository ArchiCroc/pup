import React from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { renderToStringWithData } from '@apollo/react-ssr';
import 'isomorphic-fetch';
import { onPageLoad } from 'meteor/server-render';
import { StaticRouter } from 'react-router';
import { Helmet } from 'react-helmet';
import { ServerStyleSheet, ThemeProvider } from 'styled-components';
import { Meteor } from 'meteor/meteor';
import ConfigProvider from 'antd/lib/config-provider';
import enUS from 'antd/lib/locale-provider/en_US';

/* #### PLOP_IMPORTS_START #### */
/* #### PLOP_IMPORTS_END #### */

import GlobalStyle from '../../ui/layouts/GlobalStyle';
import App from '../../ui/layouts/App';
import checkIfBlacklisted from '../../libs/server/checkIfBlacklisted';

onPageLoad(async (sink) => {
  if (checkIfBlacklisted(sink.request.url.path)) {
    sink.appendToBody(`
      <script>
        window.noSSR = true;
      </script>
    `);

    return;
  }

  const apolloClient = new ApolloClient({
    ssrMode: true,
    uri: Meteor.settings.public.graphQL.httpUri,
    cache: new InMemoryCache(),
  });

  /* #### PLOP_ONPAGELOAD_BEGIN_START #### */
  /* #### PLOP_ONPAGELOAD_BEGIN_END #### */

  const stylesheet = new ServerStyleSheet();
  const app = stylesheet.collectStyles(
    <ConfigProvider locale={enUS}>
      <ThemeProvider theme={{}}>
        <ApolloProvider client={apolloClient}>
          <GlobalStyle />
          <StaticRouter location={sink.request.url} context={{}}>
            <App location={sink.request.url} />
          </StaticRouter>
        </ApolloProvider>
      </ThemeProvider>
    </ConfigProvider>,
  );

  // NOTE: renderToStringWithData pre-fetches all queries in the component tree. This allows the data
  // from our GraphQL queries to be ready at render time.
  const content = await renderToStringWithData(app);
  const initialState = apolloClient.extract();
  const helmet = Helmet.renderStatic();

  sink.appendToHead(helmet.meta.toString());
  sink.appendToHead(helmet.title.toString());
  sink.appendToHead(stylesheet.getStyleTags());
  sink.renderIntoElementById('react-root', content);
  sink.appendToBody(`
    <script>
      window.__APOLLO_STATE__ = ${JSON.stringify(initialState).replace(/</g, '\\u003c')}
    </script>
  `);
  /* #### PLOP_ONPAGELOAD_COMPLETE_START #### */
  /* #### PLOP_ONPAGELOAD_COMPLETE_END #### */
});
