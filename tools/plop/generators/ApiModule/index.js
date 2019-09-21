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
  actions: (data) => {
    const schemaKeys = Object.keys(data.schema.fields);
    const schemaValues = Object.values(data.schema.fields);

    let primaryKeyIndex = schemaValues.findIndex((field) => field.primaryKey);
    // if primary key isn't found, set it to the first key
    if (primaryKeyIndex === -1) {
      primaryKeyIndex = 0;
    }
    data.primaryKeyField = schemaKeys[primaryKeyIndex];
    data.primaryKeyType = data.schema[data.primaryKeyField].type || 'String';

    let urlKeyIndex = schemaValues.findIndex((field) => field.urlKey);
    // if primary key isn't found, set it to the primaryKey field
    if (urlKeyIndex === -1) {
      urlKeyIndex = primaryKeyIndex;
    }
    data.urlKeyField = schemaKeys[urlKeyIndex];
    data.urlKeyType = data.schema[data.urlKeyField].type || 'String';

    let userKeyIndex = schemaValues.findIndex((field) => field.userKey);
    // if primary key isn't found, set it to the primaryKey field
    if (userKeyIndex !== -1) {
      data.userKeyField = schemaKeys[userKeyIndex];
    } else {
      data.userKeyField = 'createdById';
    }

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
        path: 'startup/server/index.js',
        pattern: '/* #### PLOP_IMPORTS_START #### */',
        template: `import '../../api/{{ pascalCase name }}/server/indexes';
import '../../api/{{ pascalCase name }}/server/rest-api';`,
      },
    ];
  },
};
