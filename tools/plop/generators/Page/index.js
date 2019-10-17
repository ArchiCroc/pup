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

const excludeDirs = ['components', 'layouts'];

module.exports = {
  description: 'Create a page',

  prompts: async (inquirer) => {
    const values = await inquirer.prompt([
      {
        type: 'list',
        name: 'moduleName',
        message: 'Select an ui module',
        choices: () => {
          return listDirectories('./ui').filter((item) => !excludeDirs.includes(item));
        },
      },
      {
        type: 'input',
        name: 'name',
        message: 'What is your page name?',
        validate: requireField('name'),
      },
    ]);
    const values2 = await inquirer.prompt([
      {
        type: 'input',
        name: 'urlSlug',
        message: `What is url for your page? ${values.moduleName}/`,
        validate: requireField('URL Slug'),
        default: slugify(changeCase.paramCase(values.name)),
      },
      {
        type: 'list',
        name: 'menu',
        message: 'Select a menu to add it to',
        choices: ['none', 'user', 'admin'],
      },
    ]);
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
  actions: (data) => {
    return [
      {
        type: 'add',
        path: 'ui/{{moduleName}}/{{pascalCase name}}.js',
        templateFile: 'tools/plop/generators/Page/templates/Page.js.hbs',
      },
      {
        type: 'add',
        path: 'ui/{{moduleName}}/{{pascalCase name}}.test.js',
        templateFile: 'tools/plop/generators/Page/templates/Page.test.js.hbs',
      },
      {
        type: 'add',
        path: 'ui/{{moduleName}}/Styled{{pascalCase name}}.js',
        templateFile: 'tools/plop/generators/Page/templates/StyledPage.js.hbs',
      },
      {
        type: 'append',
        path: 'ui/layouts/App.jsx',
        pattern: `/* #### ${changeCase.constantCase(data.moduleName)}_IMPORTS_START #### */`,
        templateFile: 'tools/plop/generators/Page/templates/app-imports.js.hbs',
      },
      {
        type: 'append',
        path: 'ui/layouts/App.jsx',
        pattern: `{/* #### ${changeCase.constantCase(data.moduleName)}_ROUTES_START #### */}`,
        templateFile: 'tools/plop/generators/Page/templates/app-routes.js.hbs',
      },
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
      {
        type: 'append',
        path: 'i18n/en/{{camelCase moduleName}}.en.i18n.yml',
        pattern: '#### PLOP_PAGES_START ####',
        template: '{{ snakeCase name }}: {{ titleCase name }}',
      },
    ];
  },
};
