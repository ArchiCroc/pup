import http from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import validators from './lib/validators';

module.exports = (options) => {
  validators.options(options);
  
  // NOTE: Conditionally load apollo-server variant if user has an existing server.
  const existingWebServer = options.config && options.config.existingWebServer;
  const existingWebSocketServer = options.config && options.config.existingWebSocketServer;
  const { ApolloServer, PubSub } = existingWebServer ? require('apollo-server-express') : require('apollo-server');

  const pubsub = new PubSub();
  const server = new ApolloServer({
    ...options.schema,
    context: async (params) => {
      const customContext = options.context ? await options.context(params) : {};
      return {
        pubsub,
        ...customContext,
      };
    },
    uploads: false,
  });

  if (existingWebServer) {
    server.applyMiddleware({
      app: existingWebServer,
      path: options.config.path || '/graphql',
    });
  } else {
    server.listen({ port: options && options.config && options.config.port || 4000 }).then(({ url }) => {
      console.log(`[PupQL] Woof! Your GraphQL server is ready at ${url}`);
    });
  }

  const websocketServer = http.createServer((request, response) => {
    response.writeHead(200);
    response.end();
  });

  websocketServer.listen(4001);

  SubscriptionServer.create({
    schema: makeExecutableSchema({ ...options.schema }),
    execute,
    subscribe,
    onConnect: () => {
      console.log(`[PupQL] Woof! Subscription client connected...`);
      return { pubsub };
    },
    onDisconnect: () => {
      console.log(`[PupQL] Woof! Subscription client disconnected...`);
    }
  }, {
    server: websocketServer,
    path: '/graphql',
  });

  // NOTE: Centralize handling of nested Promise errors here so we don't
  // have to have a bunch of .catch() callbacks and repetition.
  if (process && process.on) {
    process.on('unhandledRejection', (error) => {
      console.warn(`[PupQL] ${error}`);
    });  
  }

  return server;
};
