const { readdirSync, statSync, readFileSync } = require('fs');
const { join } = require('path');

const dirs = (p) => readdirSync(p).filter((f) => statSync(join(p, f)).isFile());

const apiModule = require('../BasicApiModule');
const i18nFile = require('../BasicI18nFile');
const uiModule = require('../BasicUIModule');

module.exports = {
  description: 'Create Basic Module with UI, i18n and API from a predefined Schema',
  prompts: [
    {
      type: 'checkbox',
      name: 'schemas',
      message: 'Select Modules to Create from Schemas',
      choices: () => {
        return dirs('./tools/plop/schemas');
      },
    },
  ],
  actions: (data) => {
    const actions = [];

    data.schemas.forEach((item) => {
      actions.push({
        type: 'comment',
        comment: `${item}`,
      });

      const rawdata = readFileSync(`./tools/plop/schemas/${item}`);
      const schema = JSON.parse(rawdata);

      actions.push(...apiModule.actions({ schema }));
      actions.push(...i18nFile.actions({ schema }));
      actions.push(...uiModule.actions({ schema }));
    });

    return actions;
  },
};
