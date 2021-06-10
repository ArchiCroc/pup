import { makeExecutableSchema } from 'graphql-tools';
import OAuthTypes from './types.gql';
import OAuthQueries from './queries';

export default {
  Query: OAuthQueries,
};
