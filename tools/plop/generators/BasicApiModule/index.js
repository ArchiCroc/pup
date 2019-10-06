/* eslint-disable  */
const fs = require('fs');
const processSchema = require('../../lib/processSchema');

const requireField = (fieldName) => {
  return (value) => {
    if (String(value).length === 0) {
      return `${fieldName} is required`;
    }
    return true;
  };
};

module.exports = {
  description: 'Create a new Basic API module from a predefined Schema',
  prompts: async (inquirer) => {
    const values = await inquirer.prompt({
      type: 'jsonFile',
      name: 'schema',
      message: 'Select a Schema to guide the module fields',
      basePath: './tools/plop/schemas',
    });
    const name = await inquirer.prompt({
      default: values.schema.name || null,
      type: 'input',
      name: 'name',
      message: 'What is your module name?',
      validate: requireField('name'),
    });
    Object.assign(values, name);
    return values;
  },
  actions: (promptData) => {
    const data = processSchema(promptData);
    return [
      {
        type: 'addMany',
        destination: 'api/{{ pascalCase name }}/',
        base: 'tools/plop/generators/ApiModule/templates/api/',
        templateFiles: 'tools/plop/generators/ApiModule/templates/api/**',
        verbose: true,
        data,
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
        pattern: '#### PLOP_QUERY_TYPES_START ####',
        templateFile: 'tools/plop/generators/ApiModule/templates/graphql-api-queries.js.hbs',
      },
      {
        type: 'append',
        path: 'startup/server/graphql-api.js',
        pattern: '#### PLOP_MUTATION_TYPES_START ####',
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
      {
        type: 'append',
        path: 'startup/server/graphql-api.js',
        pattern: '/* #### PLOP_RESOLVERS_START #### */',
        templateFile: 'tools/plop/generators/ApiModule/templates/graphql-api-resolvers.js.hbs',
      },
      {
        type: 'append',
        path: 'startup/server/index.js',
        pattern: '/* #### PLOP_IMPORTS_START #### */',
        template: `import '../../api/{{ pascalCase name }}/server/indexes';
import '../../api/{{ pascalCase name }}/server/rest-api';`,
      },
    ];
  },
};
