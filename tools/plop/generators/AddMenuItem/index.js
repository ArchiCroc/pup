/* eslint-disable  */
const fs = require('fs');
const processSchema = require('../../libs/processSchema');
const listDirectories = require('../../libs/listDirectories');
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
          name: 'name',
          message: `What is the Module Name for i18n? ${changeCase.pascal(values.uiFolderName)}/`,
          validate: requireField('i18n Module Name'),
        },
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
          name: 'label',
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
    const actions = [];
    if (data.addWrapper) {
      actions.push(
        {
          type: 'append',
          path: 'ui/components/AuthenticatedNavigation.jsx',
          pattern: '{/* #### PLOP_USER_MENU_ITEMS_START #### */}',
          templateFile: 'tools/plop/generators/AddMenuItem/templates/user-menu-wrapper.js.hbs',
          data,
        },
        {
          type: 'append',
          path: 'ui/components/AuthenticatedNavigation.jsx',
          pattern: '{/* #### PLOP_ADMIN_MENU_ITEMS_START #### */}',
          templateFile: 'tools/plop/generators/AddMenuItem/templates/admin-menu-wrapper.js.hbs',
          data,
        },
      );
    }

    if (data.menuItemType === 'user') {
      actions.push({
        type: 'append',
        path: 'ui/components/AuthenticatedNavigation.jsx',
        pattern: `{/* #### ${changeCase.constantCase(
          data.uiFolderName,
        )}_USER_MENU_ITEMS_START #### */}`,
        templateFile: 'tools/plop/generators/AddMenuItem/templates/user-menu-item.js.hbs',
        data,
      });
    }
    if (data.menuItemType === 'admin') {
      actions.push({
        type: 'append',
        path: 'ui/components/AuthenticatedNavigation.jsx',
        pattern: `{/* #### ${changeCase.constantCase(
          data.uiFolderName,
        )}_ADMIN_MENU_ITEMS_START #### */}`,
        templateFile: 'tools/plop/generators/AddMenuItem/templates/admin-menu-item.js.hbs',
        data,
      });
    }
    return actions;
  },
};
