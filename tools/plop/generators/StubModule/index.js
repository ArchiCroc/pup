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
  description: 'Create a new Stub module',
  prompts: async (inquirer) => {
    const values = {};
    // const values = await inquirer.prompt({
    //   type: 'jsonFile',
    //   name: 'schema',
    //   message: 'Select a Schema to guide the module fields',
    //   basePath: './tools/plop/schemas',
    // });
    const name = await inquirer.prompt({
      //    default: values.schema.name || null,
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
        destination: 'api/{{ apiFolderName }}/',
        base: 'tools/plop/generators/StubModule/templates/api/',
        templateFiles: 'tools/plop/generators/StubModule/templates/api/**',
        verbose: true,
        data,
      },
      {
        type: 'append',
        path: 'startup/server/graphql-api.js',
        pattern: '/* #### PLOP_IMPORTS_START #### */',
        templateFile: 'tools/plop/generators/StubModule/templates/graphql-api-imports.js.hbs',
        data,
      },
      {
        type: 'append',
        path: 'startup/server/graphql-api.js',
        pattern: '#### PLOP_TYPES_START ####',
        template: '    ${ {{~ pascalCase singularName }}Types}',
        data,
      },
      {
        type: 'append',
        path: 'startup/server/graphql-api.js',
        pattern: '#### PLOP_QUERY_TYPES_START ####',
        templateFile: 'tools/plop/generators/StubModule/templates/graphql-api-queries.js.hbs',
        data,
      },
      {
        type: 'append',
        path: 'startup/server/graphql-api.js',
        pattern: '#### PLOP_MUTATION_TYPES_START ####',
        templateFile: 'tools/plop/generators/StubModule/templates/graphql-api-mutations.js.hbs',
        data,
      },
      {
        type: 'append',
        path: 'startup/server/graphql-api.js',
        pattern: '/* #### PLOP_QUERY_RESOLVERS_START #### */',
        template: '      ...{{ pascalCase singularName }}Queries,',
        data,
      },
      {
        type: 'append',
        path: 'startup/server/graphql-api.js',
        pattern: '/* #### PLOP_MUTATION_RESOLVERS_START #### */',
        template: '      ...{{ pascalCase singularName }}Mutations,',
        data,
      },
      {
        type: 'append',
        path: 'startup/server/graphql-api.js',
        pattern: '/* #### PLOP_RESOLVERS_START #### */',
        templateFile: 'tools/plop/generators/StubModule/templates/graphql-api-resolvers.js.hbs',
        data,
      },
      {
        type: 'append',
        path: 'startup/server/index.js',
        pattern: '/* #### PLOP_IMPORTS_START #### */',
        template: `import '../../api/{{ apiFolderName }}/server/indexes';
import '../../api/{{ apiFolderName }}/server/rest-api';`,
        data,
      },
      // i18n
      {
        type: 'addMany',
        destination: 'i18n',
        base: 'tools/plop/generators/StubModule/templates/i18n/',
        templateFiles: 'tools/plop/generators/StubModule/templates/i18n/**',
        verbose: true,
        data,
      },
      {
        type: 'append',
        path: 'i18n/index.js',
        pattern: '/* #### PLOP_IMPORTS_START #### */',
        template: `import {{camelCase name}}EnI18n from './en/{{camelCase pluralName}}.en.i18n.yml';`,
        data,
      },
      // UI
      {
        type: 'addMany',
        destination: 'ui/{{ uiFolderName }}/',
        base: 'tools/plop/generators/StubModule/templates/ui/',
        templateFiles: 'tools/plop/generators/StubModule/templates/ui/**',
        verbose: true,
        data,
      },
      {
        type: 'append',
        path: 'ui/layouts/App.jsx',
        pattern: '/* #### PLOP_IMPORTS_START #### */',
        templateFile: 'tools/plop/generators/StubModule/templates/app-imports.js.hbs',
        data,
      },
      {
        type: 'append',
        path: 'ui/layouts/App.jsx',
        pattern: '{/* #### PLOP_ROUTES_START #### */}',
        templateFile: 'tools/plop/generators/StubModule/templates/app-routes.js.hbs',
        data,
      },
      {
        type: 'append',
        path: 'ui/components/AuthenticatedNavigation.jsx',
        pattern: '{/* #### PLOP_USER_MENU_ITEMS_START #### */}',
        templateFile: 'tools/plop/generators/StubModule/templates/user-menu-items.js.hbs',
        data,
      },
      {
        type: 'append',
        path: 'ui/components/AuthenticatedNavigation.jsx',
        pattern: '{/* #### PLOP_ADMIN_MENU_ITEMS_START #### */}',
        templateFile: 'tools/plop/generators/StubModule/templates/admin-menu-items.js.hbs',
        data,
      },
    ];
  },
};
