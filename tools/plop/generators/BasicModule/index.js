const apiModule = require('../ApiModule');
const i18nFile = require('../I18nFile');
const uiModule = require('../UIModule');

const requireField = (fieldName) => {
  return (value) => {
    if (String(value).length === 0) {
      return `${fieldName} is required`;
    }
    return true;
  };
};

module.exports = {
  description: 'Create a custom react hook',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'What is your module name?',
      validate: requireField('name'),
    },
    {
      type: 'jsonFile',
      name: 'schema',
      message: 'Select a Schema to guide the module fields',
      basePath: './tools/plop/schemas',
    },
  ],
  actions: (data) => {
    const actions = [];
    actions.push(...apiModule.actions(data));
    actions.push(...i18nFile.actions);
    actions.push(...uiModule.actions(data));
    return actions;
  },
};
