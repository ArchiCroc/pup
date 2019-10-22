/* eslint-disable  */
const fs = require('fs');
const processSchema = require('../../lib/processSchema');
const listDirectories = require('../../lib/listDirectories');
const slugify = require('slugify');
const changeCase = require('change-case');

const requireField = (fieldName) => {
  return (value) => {
    if (String(value).length === 0) {
      return `${fieldName} is required`;
    }
    return true;
  };
};

module.exports = {
  description: 'Create a new Document module',
  prompts: async (inquirer, values) => {
    let values2 = {};
    if (!values) {
      values = await inquirer.prompt({
        type: 'list',
        name: 'uiFolderName',
        message: 'Select an ui module',
        choices: () => {
          return listDirectories('./ui');
        },
      });
      values2 = await inquirer.prompt([
        {
          type: 'file',
          name: 'componentPath',
          message: 'choose a page component',
          extensions: ['jsx'],
          path: `./ui/${values.uiFolderName}`,
        },
      ]);
    }

    const values3 = await inquirer.prompt([
      {
        type: 'list',
        name: 'route',
        message: 'Route Type',
        choices: ['everyone', 'user', 'admin'],
        default: values2.menu === 'none' ? 'user' : values2.menu,
      },
    ]);
    Object.assign(values, values2, values3);
    return values;
  },
  actions: (promptData) => {
    console.log(promptData);
    //const regEx = //

    return [
      {
        type: 'append',
        path: 'ui/components/AuthenticatedNavigation.jsx',
        pattern: `{/* #### ${changeCase.constantCase(
          data.moduleName,
        )}_USER_MENU_ITEMS_START #### */}`,
        templateFile: 'tools/plop/generators/Page/templates/user-menu-items.js.hbs',
      },
      {
        type: 'append',
        path: 'ui/components/AuthenticatedNavigation.jsx',
        pattern: `{/* #### ${changeCase.constantCase(
          data.moduleName,
        )}_ADMIN_MENU_ITEMS_START #### */}`,
        templateFile: 'tools/plop/generators/Page/templates/admin-menu-items.js.hbs',
      },
    ];
  },
};
