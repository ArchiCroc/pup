import pupql from '@cleverbeagle/pupql';
import { WebApp } from 'meteor/webapp';
import { getUser } from 'meteor/apollo';
import schema from './graphql-api';

pupql({
  schema,
  databases: {
    mongodb: {
      connectionString: process.env.MONGO_URL,
    },
  },
  context: async ({ req }) => ({
    user: await getUser(req.headers.authorization),
  }),
  config: {
    existingWebServer: WebApp.connectHandlers,
  },
});
