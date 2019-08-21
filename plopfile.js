const pluralize = require('pluralize');
const filePath = require('inquirer-file-path'); // require('inquirer-file-tree-selection-prompt'); //

const apiModuleGenerator = require('./tools/plop/generators/ApiModule');
const componentGenerator = require('./tools/plop/generators/Component');
const pageGenerator = require('./tools/plop/generators/Page');
const hookGenerator = require('./tools/plop/generators/Hook');

function compare(v1, o1, v2, mainOperator, v3, o2, v4, options) {
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
  };
  const a1 = operators[o1](v1, v2);
  const a2 = operators[o2](v3, v4);
  const isTrue = operators[mainOperator](a1, a2);
  return isTrue ? options.fn(this) : options.inverse(this);
}

module.exports = (plop) => {
  plop.setPrompt('filePath', filePath);
  plop.setHelper('pluralize', (txt) => pluralize(txt));
  plop.setHelper('singular', (txt) => pluralize.singular(txt));
  plop.setHelper('compare', compare);

  plop.setGenerator('API Module', apiModuleGenerator);
  plop.setGenerator('Component', componentGenerator);

  plop.setGenerator('Page', pageGenerator);

  plop.setGenerator('Hook', hookGenerator);
};
