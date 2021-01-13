const path = require('path');
const listDirectories = require('../../libs/listDirectories');
const listFiles = require('../../libs/listFiles');
const relativePath = require('../../libs/relativePath');
const prettierTransform = require('../../libs/prettierTransform');

const requireField = (fieldName) => {
  return (value) => {
    if (String(value).length === 0) {
      return `${fieldName} is required`;
    }
    return true;
  };
};

module.exports = {
  description: 'Add UI Unit Tests',
  prompts: async (inquirer) => {
    const data = await inquirer.prompt([
      {
        type: 'file',
        name: 'uiFolderName',
        message: 'Select an UI module',
        selectionType: 'folder',
        path: './ui',
      },
      {
        type: 'list',
        name: 'template',
        message: 'Select Template',
        choices: () => {
          return listDirectories('tools/plop/generators/AddUIUnitTests/templates');
        },
      },
      // {
      //   type: 'input',
      //   name: 'name',
      //   message: `Action name. Should be a verb`,
      //   validate: requireField('Action name'),
      // },
    ]);

    return data;
  },
  actions: (data) => {
    // get list of files in folder
    const files = listFiles(data.uiFolderName);
    data.uiFolderName = relativePath('./ui', data.uiFolderName);
    const tasks = [];

    for (const file of files) {
      const fileParts = path.parse(file);
      //see if the name matches Page.jsx
      if (file.endsWith('Page.jsx')) {
        // add task to create test based on Page template
        // set component name from file name
        tasks.push({
          type: 'add',
          path: `ui/{{uiFolderName}}/${fileParts.name}.test.jsx`,
          templateFile:
            'tools/plop/generators/AddUIUnitTests/templates/{{template}}/page.test.jsx.hbs',
          data: { ...data, name: fileParts.name },
          transform: prettierTransform,
        });
      } else if (file.endsWith('.jsx')) {
        //else if the name matches .jsx
        tasks.push({
          type: 'add',
          path: `ui/{{uiFolderName}}/${fileParts.name}.test.jsx`,
          templateFile:
            'tools/plop/generators/AddUIUnitTests/templates/{{template}}/component.test.jsx.hbs',
          data: { ...data, name: fileParts.name },
          transform: prettierTransform,
        });
      }
      // check for a components folder and run again.
    }

    return tasks;
  },
};
