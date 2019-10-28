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
  description: 'Add Email template',
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
        message: 'Select an email template',
        choices: () => {
          return listDirectories('tools/plop/generators/AddEmailTemplate/templates');
        },
      },
      {
        type: 'input',
        name: 'name',
        message: `Email template name`,
        validate: requireField('Template name'),
      },
    ]);

    return data;
  },
  actions: (data) => {
    data.apiFolderName = relativePath('./api', data.apiFolderName);
    return [
      {
        type: 'add',
        path: 'private/email-templates/{{uiDirCase apiFolderName}}/{{dashCase name}}.html',
        templateFile:
          'tools/plop/generators/AddEmailTemplate/templates/{{template}}/emailTemplate.html.hbs',
        data,
      },
      {
        type: 'add',
        path: 'private/email-templates/{{uiDirCase apiFolderName}}/{{dashCase name}}.txt',
        templateFile:
          'tools/plop/generators/AddEmailTemplate/templates/{{template}}/emailTemplate.txt.hbs',
        data,
      },
      {
        type: 'add',
        path: 'api/{{apiFolderName}}/actions/send{{pascalCase name}}Email.js',
        templateFile: 'tools/plop/generators/AddEmailTemplate/templates/{{template}}/action.js.hbs',
        data,
      },
    ];
  },
};
