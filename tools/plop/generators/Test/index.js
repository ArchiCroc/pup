// const apiModule = require('../BasicApiModule');
// const i18nFile = require('../BasicI18nFile');
// const uiModule = require('../BasicUIModule');

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
    const result = await inquirer.prompt({
      type: 'jsonFile',
      name: 'schema',
      message: 'Select a Schema to guide the module fields',
      basePath: './tools/plop/schemas',
    });
    const name = await inquirer.prompt({
      default: result.schema.name || null,
      type: 'input',
      name: 'name',
      message: 'What is your module name?',
      validate: requireField('name'),
    });

    Object.assign(result, name);
    return result;

    // console.log('[prompt]', inquirer);
    // return inquirer
    //   .prompt({
    //     type: 'jsonFile',
    //     name: 'schema',
    //     message: 'Select a Schema to guide the module fields',
    //     basePath: './tools/plop/schemas',
    //   })
    //   .then((value) => {
    //     // there has to be a better way to do this but hey! this works for the moment
    //     values.schema = value.schema;

    //     return inquirer.prompt({
    //       default: value.schema.name || null,
    //       type: 'input',
    //       name: 'name',
    //       message: 'What is your module name?',
    //       validate: requireField('name'),
    //     });
    //   })
    //   .then((value) => {
    //     values.name = value.name;
    //     return values;
    //   });
    // return new Promise((resolve) => {
    //   const prompts = new Rx.Subject();

    //   inquirer.prompt(prompts).ui.process.subscribe(
    //     (ans) => {
    //       // console.log('Answer is: ', ans);
    //       values[ans.name] = ans.answer;
    //     },
    //     (err) => {
    //       console.log('Error: ', err);
    //     },
    //     (stuff) => {
    //       console.log('Completed', stuff);
    //       resolve(stuff);
    //     },
    //   );

    //   // At some point in the future, push new questions
    //   prompts.next({
    //     type: 'jsonFile',
    //     name: 'schema',
    //     message: 'Select a Schema to guide the module fields',
    //     basePath: './tools/plop/schemas',
    //   });
    //   // hmm would be nice if this worked...
    //   prompts.next(() =>( {
    //     default: values.schema.name || null,
    //     type: 'input',
    //     name: 'name',
    //     message: 'What is your module name?',
    //     validate: requireField('name'),
    //   }));

    //   // When you're done
    //   prompts.complete();
    // });
  },
  actions: (data) => {
    // console.log('actions', values);
    const actions = [
      {
        type: 'comment',
        comment: `Test Action`,
      },
    ];
    // actions.push(...apiModule.actions(data));
    // actions.push(...i18nFile.actions);
    // actions.push(...uiModule.actions(data));
    return actions;
  },
};
