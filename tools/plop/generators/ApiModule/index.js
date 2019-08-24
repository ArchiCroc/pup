/* eslint-disable  */
const fs = require('fs');

const requireField = (fieldName) => {
  return (value) => {
    if (String(value).length === 0) {
      return `${fieldName} is required`;
    }
    return true;
  };
};

module.exports = {
  description: 'Create a new api module',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'What is your api module name?',
      validate: requireField('name'),
      filter(value) {
        console.log(value);
        return value;
      },
    },
    {
      type: 'jsonFile',
      name: 'schema',
      message: 'Select a Schema to guide the module fields',
      basePath: './tools/plop/schemas',
    },
  ],
  actions: [
    {
      type: 'addMany',
      destination: 'api/{{ pascalCase name }}/',
      base: 'tools/plop/generators/ApiModule/templates/api/',
      templateFiles: 'tools/plop/generators/ApiModule/templates/api/**',
      verbose: true,
    },
    {
      type: 'append',
      path: 'startup/server/graphql-api.js',
      pattern: '/* #### PLOP_IMPORTS_START #### */',
      templateFile: 'tools/plop/generators/ApiModule/templates/graphql-api-imports.js.hbs',
    },
    {
      type: 'append',
      path: 'startup/server/graphql-api.js',
      pattern: '#### PLOP_TYPES_START ####',
      template: '    ${ {{~ pascalCase (singular name) }}Types}',
    },
    {
      type: 'append',
      path: 'startup/server/graphql-api.js',
      pattern: '#### PLOP_QUERY_TYPE_START ####',
      templateFile: 'tools/plop/generators/ApiModule/templates/graphql-api-queries.js.hbs',
    },
    {
      type: 'append',
      path: 'startup/server/graphql-api.js',
      pattern: '#### PLOP_MUTATION_TYPE_START ####',
      templateFile: 'tools/plop/generators/ApiModule/templates/graphql-api-mutations.js.hbs',
    },
    {
      type: 'append',
      path: 'startup/server/graphql-api.js',
      pattern: '/* #### PLOP_QUERY_RESOLVERS_START #### */',
      template: '      ...{{ pascalCase (singular name) }}Queries,',
    },
    {
      type: 'append',
      path: 'startup/server/graphql-api.js',
      pattern: '/* #### PLOP_MUTATION_RESOLVERS_START #### */',
      template: '      ...{{ pascalCase (singular name) }}Mutations,',
    },
  ],
};
