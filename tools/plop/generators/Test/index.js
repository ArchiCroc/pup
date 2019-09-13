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

module.exports = {
  description: 'Test Plop Functions',
  prompts: async (inquirer) => {
    console.log('[prompt]', inquirer);
    return inquirer
      .prompt({
        type: 'list',
        name: 'weapon',
        message: 'Pick one',
        choices: [
          'Use the stick',
          'Grab a large rock',
          'Try and make a run for it',
          'Attack the wolf unarmed',
        ],
      })
      .then(() => {
        console.log('The wolf mauls you. You die. The end.');
      });

    // const prompts = new Rx.Subject();

    // inquirer.prompt(prompts);

    // // inquirer.prompt(prompts).ui.process.subscribe(
    // //   function(ans) {
    // //     console.log('Answer is: ', ans);
    // //   },
    // //   function(err) {
    // //     console.log('Error: ', err);
    // //   },
    // //   function() {
    // //     console.log('Completed');
    // //   },
    // // );

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
  },
  actions: (data) => {
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
