const slugify = require('slugify');
const changeCase = require('change-case');
const listDirectories = require('../../lib/listDirectories');
const addMenuItem = require('../AddMenuItem');
const addRoute = require('../AddRoute');

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
        name: 'uiFolderName',
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
        message: `What is url for your page? ${values.uiFolderName}/`,
        validate: requireField('URL Slug'),
        default: slugify(changeCase.paramCase(values.name)),
      },
    ]);
    Object.assign(values, values2);
    const values3 = await addRoute.prompts(inquirer, values);
    Object.assign(values, values3);
    const values4 = await addMenuItem.prompts(inquirer, values);
    Object.assign(values, values4);
    return values;
  },
  actions: (data) => {
    let actions = [
      {
        type: 'add',
        path: 'ui/{{uiFolderName}}/{{pascalCase name}}.jsx',
        templateFile: 'tools/plop/generators/Page/templates/Page.jsx.hbs',
      },
      {
        type: 'add',
        path: 'ui/{{uiFolderName}}/{{pascalCase name}}.test.js',
        templateFile: 'tools/plop/generators/Page/templates/Page.test.js.hbs',
      },
      {
        type: 'add',
        path: 'ui/{{uiFolderName}}/Styled{{pascalCase name}}.js',
        templateFile: 'tools/plop/generators/Page/templates/StyledPage.js.hbs',
      },
      {
        type: 'append',
        path: 'i18n/en/{{camelCase uiFolderName}}.en.i18n.yml',
        pattern: '#### PLOP_PAGES_START ####',
        template: '{{ snakeCase name }}: {{ titleCase name }}',
      },
    ];
    actions = actions.concat(
      addRoute.actions({ ...data, componentPath: `${changeCase.pascalCase(data.name)}.jsx` }),
    );
    actions = actions.concat(addMenuItem.actions(data));

    return actions;
  },
};
