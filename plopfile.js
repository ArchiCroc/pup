const pluralize = require('pluralize');
const filePath = require('inquirer-parse-json-file'); // require('inquirer-file-tree-selection-prompt'); //

const { readdirSync, statSync } = require('fs');
const { join } = require('path');
const apiModuleGenerator = require('./tools/plop/generators/ApiModule');
const uiModuleGenerator = require('./tools/plop/generators/UIModule');
const componentGenerator = require('./tools/plop/generators/Component');
const pageGenerator = require('./tools/plop/generators/Page');
const hookGenerator = require('./tools/plop/generators/Hook');
const i18nFileGenerator = require('./tools/plop/generators/I18nFile');
const basicModuleGenerator = require('./tools/plop/generators/BasicModule');

const dirs = (p) => readdirSync(p).filter((f) => statSync(join(p, f)).isDirectory());

function comment(data, userConfig, plop) {
  const { comment = '' } = userConfig;
  return plop.renderString(comment, data); // render the comment as hbs templates
}

function compare(v1, o1, v2, mainOperator, v3, o2, v4, opts) {
  let options = opts;
  const operators = {
    '==': (a, b) => a == b,
    '===': (a, b) => a === b,
    '!=': (a, b) => a != b,
    '!==': (a, b) => a !== b,
    '<': (a, b) => a < b,
    '<=': (a, b) => a <= b,
    '>': (a, b) => a > b,
    '>=': (a, b) => a >= b,
    '&&': (a, b) => a && b,
    '||': (a, b) => a || b,
    includes: (a, b) => b.split('|').includes(a),
    '!includes': (a, b) => !b.split('|').includes(a),
    startsWith: (a, b) => a.startsWith(b),
    '!startsWith': (a, b) => !a.startsWith(b),
    typeof: (a, b) => typeof a === b,
  };
  const a1 = operators[o1](v1, v2);
  let isTrue;
  if (o2) {
    const a2 = operators[o2](v3, v4);
    isTrue = operators[mainOperator](a1, a2);
  } else {
    isTrue = a1;
    options = mainOperator;
  }
  return isTrue ? options.fn(this) : options.inverse(this);
}

module.exports = (plop) => {
  plop.setPrompt('jsonFile', filePath);
  plop.setActionType('comment', comment);
  plop.setHelper('pluralize', (txt) => pluralize(txt));
  plop.setHelper('singular', (txt) => pluralize.singular(txt));
  plop.setHelper('compare', compare);
  plop.setHelper('log', console.log);
  plop.setHelper('stripBrackets', (text) => {
    return text.replace(/\[(\w+)\]/, '$1');
  });

  const generators = dirs('./tools/plop/generators');

  generators.forEach((folder) => {
    // this is kinda dangerous but I think this is the best solution
    // eslint-disable-next-line
    const object = require(`./tools/plop/generators/${folder}`);
    plop.setGenerator(folder, object);
  });

  // plop.setGenerator('Add Basic Module', basicModuleGenerator);
  // plop.setGenerator('API Module', apiModuleGenerator);
  // plop.setGenerator('UI Module', uiModuleGenerator);
  // plop.setGenerator('Component', componentGenerator);
  // plop.setGenerator('Page', pageGenerator);
  // plop.setGenerator('Hook', hookGenerator);
  // plop.setGenerator('I18n File', i18nFileGenerator);
};
