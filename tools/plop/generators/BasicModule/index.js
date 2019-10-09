const apiModule = require('../BasicApiModule');
const i18nFile = require('../BasicI18nFile');
const uiModule = require('../BasicUIModule');

const requireField = (fieldName) => {
  return (value) => {
    if (String(value).length === 0) {
      return `${fieldName} is required`;
    }
    return true;
  };
};

module.exports = {
  description: 'Create Basic Module with UI, i18n and API from a predefined Schema',
  prompts: async (inquirer) => {
    const values = await inquirer.prompt({
      type: 'jsonFile',
      name: 'schema',
      message: 'Select a Schema to guide the module fields',
      basePath: './tools/plop/schemas',
    });
    const name = await inquirer.prompt({
      default: values.schema.name || null,
      type: 'input',
      name: 'name',
      message: 'What is your module name?',
      validate: requireField('name'),
    });
    Object.assign(values, name);
    return values;
  },
  actions: (data) => {
    // console.log('actions', values);
    const actions = [
      // {
      //   type: 'comment',
      //   comment: `Test Action`,
      // },
    ];
    actions.push(...apiModule.actions(data));
    actions.push(...i18nFile.actions(data));
    actions.push(...uiModule.actions(data));
    return actions;
  },
};
