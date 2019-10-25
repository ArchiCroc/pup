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
  description: 'Add Email template',
  prompts: async (inquirer) => {
    const data = await inquirer.prompt([
      {
        type: 'list',
        name: 'apiFolderName',
        message: 'Select an api module',
        choices: () => {
          return listDirectories('./api');
        },
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
    return [
      {
        type: 'add',
        path: 'private/email-templates/{{dashCase apiFolderName}}/{{dashCase name}}.html',
        templateFile:
          'tools/plop/generators/AddEmailTemplate/templates/{{template}}/emailTemplate.html.hbs',
      },
      {
        type: 'add',
        path: 'private/email-templates/{{dashCase apiFolderName}}/{{dashCase name}}.txt',
        templateFile:
          'tools/plop/generators/AddEmailTemplate/templates/{{template}}/emailTemplate.txt.hbs',
      },
      {
        type: 'add',
        path: 'api/{{apiFolderName}}/actions/send{{pascalCase name}}Email.js',
        templateFile: 'tools/plop/generators/AddEmailTemplate/templates/{{template}}/action.js.hbs',
      },
    ];
  },
};
