const listDirectories = require('../../lib/listDirectories');

const requireField = (fieldName) => {
  return (value) => {
    if (String(value).length === 0) {
      return `${fieldName} is required`;
    }
    return true;
  };
};

module.exports = {
  description: 'WIP - Create a reusable component',
  prompts: [
    {
      type: 'list',
      name: 'moduleName',
      message: 'Select an ui module',
      choices: () => {
        return listDirectories('./ui');
      },
    },
    {
      type: 'input',
      name: 'name',
      message: 'What is your component name?',
      validate: requireField('name'),
    },
  ],
  actions: [
    {
      type: 'add',
      path: 'ui/{{moduleName}}/components/{{pascalCase name}}.js',
      templateFile: 'tools/plop/generators/Component/Component.js.hbs',
    },
    {
      type: 'add',
      path: 'ui/{{moduleName}}/components/{{pascalCase name}}.test.js',
      templateFile: 'tools/plop/generators/Component/Component.test.js.hbs',
    },
  ],
};
