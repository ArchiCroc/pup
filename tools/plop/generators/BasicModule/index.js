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

const values = {};

module.exports = {
  description: 'Create Basic Module with UI, i18n and API',
  prompts: async (inquirer) => {
    // console.log('[prompt]', inquirer);
    return inquirer
      .prompt({
        type: 'jsonFile',
        name: 'schema',
        message: 'Select a Schema to guide the module fields',
        basePath: './tools/plop/schemas',
      })
      .then((value) => {
        // there has to be a better way to do this but hey! this works for the moment
        values.schema = value.schema;

        return inquirer.prompt({
          default: value.schema.name || null,
          type: 'input',
          name: 'name',
          message: 'What is your module name?',
          validate: requireField('name'),
        });
      })
      .then((value) => {
        values.name = value.name;
        return values;
      });
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
    actions.push(...i18nFile.actions);
    actions.push(...uiModule.actions(data));
    return actions;
  },
};
