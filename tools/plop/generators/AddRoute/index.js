/* eslint-disable  */
const fs = require('fs');
const path = require('path');
const processSchema = require('../../lib/processSchema');
const listDirectories = require('../../lib/listDirectories');
const slugify = require('slugify');
const changeCase = require('change-case');
const normalizePath = require('../../lib/normalizePath');

const requireField = (fieldName) => {
  return (value) => {
    if (String(value).length === 0) {
      return `${fieldName} is required`;
    }
    return true;
  };
};

module.exports = {
  description: 'Add a new Route',
  prompts: async (inquirer, values) => {
    let values2 = {};
    if (!values) {
      values = await inquirer.prompt({
        type: 'list',
        name: 'uiFolderName',
        message: 'Select an ui module',
        choices: () => {
          return listDirectories('./ui', ['components']);
        },
      });
      values2 = await inquirer.prompt([
        {
          type: 'file',
          name: 'componentPath',
          message: 'choose a page component',
          extensions: ['.jsx'],
          // onlyShowMatchingExtensions: true,
          path: `./ui/${values.uiFolderName}`,
        },
      ]);

      const rel = path.relative(`./ui/${values.uiFolderName}`, values2.componentPath);
      const cleanPath = normalizePath(rel);
      values2.componentPath = cleanPath;
      console.log(cleanPath.split('.').splice(-1, 1));
      let componentParts = cleanPath.split('.');
      componentParts.pop();
      componentParts = componentParts.join('').split('/');

      values2.componentName = componentParts.map((item) => changeCase.pascalCase(item)).join('');
      const defaultSlug = componentParts.map((item) => changeCase.paramCase(item)).join('/');

      values3 = await inquirer.prompt([
        {
          type: 'input',
          name: 'urlSlug',
          message: `What is url for your page? ${values.uiFolderName}/`,
          validate: requireField('URL Slug'),
          default: defaultSlug,
        },
      ]);
    }

    const values4 = await inquirer.prompt([
      {
        type: 'list',
        name: 'route',
        message: 'Route Type',
        choices: ['everyone', 'user', 'admin'],
        default: values2.menu === 'none' ? 'user' : values2.menu,
      },
    ]);
    Object.assign(values, values2, values3, values4);
    return values;
  },
  actions: (data) => {
    return [
      {
        type: 'append',
        path: 'ui/layouts/App.jsx',
        pattern: `/* #### ${changeCase.constant(data.uiFolderName)}_IMPORTS_START #### */`,
        templateFile: 'tools/plop/generators/AddRoute/templates/app-imports.js.hbs',
        data,
      },
      {
        type: 'append',
        path: 'ui/layouts/App.jsx',
        pattern: `{/* #### ${changeCase.constant(data.uiFolderName)}_ROUTES_START #### */}`,
        templateFile: 'tools/plop/generators/AddRoute/templates/app-routes.js.hbs',
        data,
      },
    ];
  },
};
