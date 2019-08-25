/* eslint-disable  */
const fs = require('fs');
const _ = require('lodash');

const requireField = (fieldName) => {
  return (value) => {
    if (String(value).length === 0) {
      return `${fieldName} is required`;
    }
    return true;
  };
};

const uniformsFields = [
  'Auto',
  'Bool',
  'Date',
  'Hidden',
  'List',
  'ListItem',
  'Long',
  'Num',
  'Radio',
  'Select',
  'Submit',
  'Text',
];

module.exports = {
  description: 'Create a new UI module',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'What is your UI module name?',
      validate: requireField('name'),
    },
    {
      type: 'jsonFile',
      name: 'schema',
      message: 'Select a Schema to guide the module fields',
      basePath: './tools/plop/schemas',
    },
  ],
  actions: (data) => {
    data.fieldImports = _.uniq(data.schema.filter((field) => field.input)).map((field) => ({
      variable: `${field}Field`,
      path: uniformsFields.includes(field)
        ? `uniforms-antd/${field}Field`
        : `../components/${field}Field`,
    }));

    return [
      {
        type: 'addMany',
        destination: 'ui/{{ dashCase name }}/',
        base: 'tools/plop/generators/UIModule/templates/ui/',
        templateFiles: 'tools/plop/generators/UIModule/templates/ui/**',
        verbose: true,
        data,
      },
      // {
      //   type: 'append',
      //   path: 'startup/server/graphql-api.js',
      //   pattern: '/* #### PLOP_IMPORTS_START #### */',
      //   templateFile: 'tools/plop/generators/ApiModule/templates/graphql-api-imports.js.hbs',
      // },
      // {
      //   type: 'append',
      //   path: 'startup/server/graphql-api.js',
      //   pattern: '#### PLOP_TYPES_START ####',
      //   template: '    ${ {{~ pascalCase (singular name) }}Types}',
      // },
      // {
      //   type: 'append',
      //   path: 'startup/server/graphql-api.js',
      //   pattern: '#### PLOP_QUERY_TYPE_START ####',
      //   templateFile: 'tools/plop/generators/ApiModule/templates/graphql-api-queries.js.hbs',
      // },
      // {
      //   type: 'append',
      //   path: 'startup/server/graphql-api.js',
      //   pattern: '#### PLOP_MUTATION_TYPE_START ####',
      //   templateFile: 'tools/plop/generators/ApiModule/templates/graphql-api-mutations.js.hbs',
      // },
      // {
      //   type: 'append',
      //   path: 'startup/server/graphql-api.js',
      //   pattern: '/* #### PLOP_QUERY_RESOLVERS_START #### */',
      //   template: '      ...{{ pascalCase (singular name) }}Queries,',
      // },
      // {
      //   type: 'append',
      //   path: 'startup/server/graphql-api.js',
      //   pattern: '/* #### PLOP_MUTATION_RESOLVERS_START #### */',
      //   template: '      ...{{ pascalCase (singular name) }}Mutations,',
      // },
    ];
  },
};
