/* eslint-disable  */
const fs = require('fs');
const _ = require('lodash');
const processSchema = require('../../lib/processSchema');

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
  'LongText',
  'Num',
  'Radio',
  'Select',
  'Submit',
  'Text',
];

module.exports = {
  description: 'Create a new Basic UI module from a predefined Schema',
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

    const schemaKeys = Object.keys(data.schema.fields);
    const schemaValues = Object.values(data.schema.fields);

    let hasList = false;
    data.fieldImports = _.uniqBy(
      schemaValues
        .filter((field) => field.input)
        .map(({ input, type }) => {
          if (type.startsWith('[') || type === 'Object') {
            hasList = true;
          }
          return {
            variable: `${input}Field`,
            path: uniformsFields.includes(input)
              ? `uniforms-antd/${input}Field`
              : `../../components/${input}Field`,
          };
        }),
      'variable',
    );
    if (hasList) {
      data.fieldImports.push({
        variable: `ListField`,
        path: `uniforms-antd/ListField`,
      });
      data.fieldImports.push({
        variable: `ListItemField`,
        path: `uniforms-antd/ListItemField`,
      });
    }

    return [
      {
        type: 'addMany',
        destination: 'ui/{{ uiFolderName }}/',
        base: 'tools/plop/generators/BasicUIModule/templates/ui/',
        templateFiles: 'tools/plop/generators/BasicUIModule/templates/ui/**',
        verbose: true,
        data,
      },
      {
        type: 'append',
        path: 'ui/layouts/App.jsx',
        pattern: '/* #### PLOP_IMPORTS_START #### */',
        templateFile: 'tools/plop/generators/BasicUIModule/templates/app-imports.js.hbs',
      },
      {
        type: 'append',
        path: 'ui/layouts/App.jsx',
        pattern: '{/* #### PLOP_ROUTES_START #### */}',
        templateFile: 'tools/plop/generators/BasicUIModule/templates/app-routes.js.hbs',
      },
      {
        type: 'append',
        path: 'ui/components/AuthenticatedNavigation.jsx',
        pattern: '{/* #### PLOP_USER_MENU_ITEMS_START #### */}',
        templateFile: 'tools/plop/generators/BasicUIModule/templates/user-menu-items.js.hbs',
      },
      {
        type: 'append',
        path: 'ui/components/AuthenticatedNavigation.jsx',
        pattern: '{/* #### PLOP_ADMIN_MENU_ITEMS_START #### */}',
        templateFile: 'tools/plop/generators/BasicUIModule/templates/admin-menu-items.js.hbs',
      },
    ];
  },
};

// /ui/components/AuthenticatedNavigation.jsx
// {/* #### PLOP_USER_MENU_ITEMS_START #### */}
// /ui/components/AuthenticatedNavigation.jsx
//{/* #### PLOP_ADMIN_MENU_ITEMS_START #### */}
