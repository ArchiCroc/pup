export default {
  options(options) {
    if (!options.schema) throw new Error('[PupQL] Woah there, pup! You need to pass a GraphQL schema for us.');
  },
};
