const listDirectories = require('../../libs/listDirectories');
const relativePath = require('../../libs/relativePath');

const requireField = (fieldName) => {
  return (value) => {
    if (String(value).length === 0) {
      return `${fieldName} is required`;
    }
    return true;
  };
};

module.exports = {
  description: 'Add Api Action',
  prompts: async (inquirer) => {
    const data = await inquirer.prompt([
      {
        type: 'file',
        name: 'apiFolderName',
        message: 'Select an api module',
        selectionType: 'folder',
        path: './api',
      },
      {
        type: 'list',
        name: 'template',
        message: 'Select Action Template',
        choices: () => {
          return listDirectories('tools/plop/generators/AddApiAction/templates');
        },
      },
      {
        type: 'input',
        name: 'name',
        message: `Action name. Should be a verb`,
        validate: requireField('Action name'),
      },
    ]);

    return data;
  },
  actions: (data) => {
    data.apiFolderName = relativePath('./api', data.apiFolderName);
    return [
      {
        type: 'add',
        path: 'api/{{apiFolderName}}/actions/{{camelCase name}}.js',
        templateFile: 'tools/plop/generators/AddApiAction/templates/{{template}}/action.js.hbs',
        data,
      },
    ];
  },
};
