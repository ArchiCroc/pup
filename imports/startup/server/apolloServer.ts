import { ApolloServer } from 'apollo-server-express';
import { WebApp } from 'meteor/webapp';
import { getUser } from 'meteor/apollo';
import schema from './graphqlApi';

const server = new ApolloServer({
  schema,
  context: async ({ req }) => ({
    user: await getUser(req.headers.authorization),
  }),
  uploads: false,
});

server.applyMiddleware({
  //@ts-ignore //not sure why this is throwing an error app just needs a object with a use function and WebApp.connectHandlers has that
  app: WebApp.connectHandlers,
  path: '/graphql',
});
