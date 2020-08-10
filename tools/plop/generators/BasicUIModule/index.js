/* eslint-disable  */
const fs = require('fs');
const _ = require('lodash');
const changeCase = require('change-case');
const processSchema = require('../../libs/processSchema');
const prettierTransform = require('../../libs/prettierTransform');
const addMenuItem = require('../AddMenuItem');

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
  // 'Select', // use our own component
  'Submit',
  'Text',
];

const nonListFields = ['Select', 'CheckBoxes', 'CrossReferenceSelect', 'CrossReferenceSearch'];

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
    // push all the sub fields to the schemaValues
    schemaValues.forEach((field) => {
      if (field.fields) {
        for (let currentField of Object.values(field.fields)) {
          schemaValues.push(currentField);
        }
      }
    });

    let hasList = schemaValues.find(({ input, type }) => {
      if (typeof input === 'object') {
        type = input.type;
        input = input.input;
      }
      return (type.startsWith('[') && !nonListFields.includes(input)) || input === 'list';
    });

    let fieldImports = [];
    let uniformsImports = [];

    if (hasList) {
      uniformsImports.push('List');
      uniformsImports.push('ListItem');
    }

    schemaValues
      .filter(
        (field) =>
          (typeof field.input === 'object' && field.input.input) || typeof field.input === 'string',
      )
      .forEach(({ input, type }) => {
        if (typeof input === 'object') {
          type = input.type;
          input = input.input;
        }

        if (uniformsFields.includes(input)) {
          if (!uniformsImports.includes(input)) {
            uniformsImports.push(input);
          }
        } else {
          fieldImports.push({
            variable: `${input}Field`,
            path: `${data.uiPathOffset}../../components/${input}Field`, //@todo figure out a way to define a custom import in the schema
          });
        }
      });

    // pack all the uniforms imports into a single line
    if (uniformsImports.length > 0) {
      fieldImports.push({
        variable: `{ ${uniformsImports.sort().join('Field, ')}Field }`,
        path: 'uniforms-antd', //@todo figure out a way to define a custom import in the schema
      });
    }

    data.fieldImports = _.uniqBy(fieldImports, 'variable');
    data.hasListField = hasList;

    const actions = [
      {
        type: 'addMany',
        destination: 'ui/{{ uiFolderName }}/',
        base: 'tools/plop/generators/BasicUIModule/templates/ui/',
        templateFiles: 'tools/plop/generators/BasicUIModule/templates/ui/**/+(*.js.hbs|*.jsx.hbs)',
        verbose: true,
        data,
        transform: prettierTransform,
      },
      {
        type: 'addMany',
        destination: 'ui/{{ uiFolderName }}/',
        base: 'tools/plop/generators/BasicUIModule/templates/ui/',
        templateFiles: 'tools/plop/generators/BasicUIModule/templates/ui/**/!(*.js.hbs|*.jsx.hbs)',
        verbose: true,
        data,
      },
      {
        type: 'append',
        path: 'ui/layouts/App.jsx',
        pattern: '/* #### PLOP_IMPORTS_START #### */',
        template: `
          /* #### {{ constantCase pluralName }}_IMPORTS_START #### */
          /* #### {{ constantCase pluralName }}_IMPORTS_END #### */`,
        data,
      },
      {
        type: 'append',
        path: 'ui/layouts/App.jsx',
        pattern: `/* #### ${changeCase.constantCase(data.pluralName)}_IMPORTS_START #### */`,
        templateFile: 'tools/plop/generators/BasicUIModule/templates/app-imports.js.hbs',
        data,
      },
      {
        type: 'append',
        path: 'ui/layouts/App.jsx',
        pattern: '{/* #### PLOP_ROUTES_START #### */}',
        template: `
          {/* #### {{ constantCase pluralName }}_ROUTES_START #### */}
          {/* #### {{ constantCase pluralName }}_ROUTES_END #### */}`,
        data,
      },
      {
        type: 'append',
        path: 'ui/layouts/App.jsx',
        pattern: `{/* #### ${changeCase.constantCase(data.pluralName)}_ROUTES_START #### */}`,
        templateFile: 'tools/plop/generators/BasicUIModule/templates/app-routes.js.hbs',
        data,
      },
      {
        type: 'modify',
        path: 'ui/layouts/App.jsx',
        transform: prettierTransform,
        data,
      },
    ];
    if (data.schema.menu && data.schema.menu.index) {
      actions.push(
        ...addMenuItem.actions({
          ...data,
          label: `${data.shortSingularName}_plural`,
          menuItemType: data.schema.menu.index,
          addWrapper: true,
        }),
      );
    }
    return actions;
  },
};

// /ui/components/AuthenticatedNavigation.jsx
// {/* #### PLOP_USER_MENU_ITEMS_START #### */}
// /ui/components/AuthenticatedNavigation.jsx
//{/* #### PLOP_ADMIN_MENU_ITEMS_START #### */}
