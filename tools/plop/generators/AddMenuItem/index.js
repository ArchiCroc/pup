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
  description: 'Add a new Menu Item',
  prompts: async (inquirer, values) => {
    if (!values) {
      values = await inquirer.prompt([
        {
          type: 'list',
          name: 'uiFolderName',
          message: 'Select an ui module',
          choices: () => {
            return listDirectories('./ui', ['components', 'layouts']);
          },
        },
      ]);

      const values2 = await inquirer.prompt([
        {
          type: 'input',
          name: 'urlSlug',
          message: `What is url for your page? ${values.uiFolderName}/`,
          validate: requireField('URL Slug'),
        },
      ]);

      const values3 = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: `What should the menu label say?`,
          validate: requireField('URL Slug'),
          default: changeCase.titleCase(values2.urlSlug),
        },
      ]);
      // values.routeType == 'user';
      Object.assign(values, values3);
    }

    const values4 = await inquirer.prompt([
      {
        type: 'list',
        name: 'menuItemType',
        message: 'Select a menu to add it to',
        choices: ['none', 'user', 'admin'],
        default: values.routeType === 'everyone' ? 'user' : values.routeType,
      },
    ]);
    Object.assign(values, values4);
    return values;
  },
  actions: (data) => {
    if (data.menuItemType === 'user') {
      return [
        {
          type: 'append',
          path: 'ui/components/AuthenticatedNavigation.jsx',
          pattern: `{/* #### ${changeCase.constantCase(
            data.uiFolderName,
          )}_USER_MENU_ITEMS_START #### */}`,
          templateFile: 'tools/plop/generators/AddMenuItem/templates/user-menu-items.js.hbs',
          data,
        },
      ];
    }
    if (data.menuItemType === 'admin') {
      return [
        {
          type: 'append',
          path: 'ui/components/AuthenticatedNavigation.jsx',
          pattern: `{/* #### ${changeCase.constantCase(
            data.uiFolderName,
          )}_ADMIN_MENU_ITEMS_START #### */}`,
          templateFile: 'tools/plop/generators/AddMenuItem/templates/admin-menu-items.js.hbs',
          data,
        },
      ];
    }
    return [];
  },
};
