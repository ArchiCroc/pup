const Rx = require('rxjs');
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
/*
module.exports = {
  description: 'Create a Basic Module from Schema',
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
*/

const values = {};

module.exports = {
  description: 'Test Plop Functions',
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

    // const prompts = new Rx.Subject();

    // inquirer.prompt(prompts).ui.process.subscribe(
    //   function(ans) {
    //     console.log('Answer is: ', ans);
    //   },
    //   function(err) {
    //     console.log('Error: ', err);
    //   },
    //   function(stuff) {
    //     console.log('Completed', stuff);
    //   },
    // );

    // // At some point in the future, push new questions
    // prompts.next({
    //   type: 'input',
    //   name: 'name',
    //   message: 'What is your module name?',
    //   validate: requireField('name'),
    // });
    // prompts.next({
    //   type: 'input2',
    //   name: 'name',
    //   message: 'A second Name',
    //   validate: requireField('name'),
    // });

    // // When you're done
    // prompts.complete();
    // return inquirer;
  },
  actions: (data) => {
    // console.log('actions', values);
    const actions = [
      {
        type: 'comment',
        comment: `Test Action`,
      },
    ];
    actions.push(...apiModule.actions(data));
    actions.push(...i18nFile.actions);
    actions.push(...uiModule.actions(data));
    return actions;
  },
};
