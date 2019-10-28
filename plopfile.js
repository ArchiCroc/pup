const pluralize = require('pluralize');
const changeCase = require('change-case');
const jsonFilePath = require('inquirer-parse-json-file'); // require('inquirer-file-tree-selection-prompt'); //
const filePath = require('inquirer-file-selector-prompt');
const _ = require('lodash');

const { readdirSync, statSync } = require('fs');
const { join } = require('path');

const dirs = (p) => readdirSync(p).filter((f) => statSync(join(p, f)).isDirectory());

function comment(data, userConfig, plop) {
  const { comment = '' } = userConfig;
  return plop.renderString(comment, data); // render the comment as hbs templates
}

function convertDataIndexToGraphqlSubQuery(dataIndex, indent = 0) {
  const parts = dataIndex.split('.');
  let start = '';
  let end = '';

  parts.forEach((part, index) => {
    start += '  '.repeat(!!index && index + indent);
    start += part;

    if (index + 1 < parts.length) {
      start += ' {';
    }
    start += '\n';

    if (index + 1 < parts.length) {
      end = `${'  '.repeat(index + indent)}}${index ? '\n' : ''}${end}`;
    }
  });

  return start + end;
}

function betterTypeof(a, b) {
  if (b === 'array') {
    return a && Array.isArray(a);
  }
  if (b === 'object') {
    return a && a instanceof Object && !(a instanceof Array);
  }
  return typeof a === b;
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
    includes: (a, b) => a && a.includes(b),
    '!includes': (a, b) => a && !a.includes(b),
    in: (a, b) => b.split('|').includes(a),
    '!in': (a, b) => !b.split('|').includes(a),
    startsWith: (a, b) => a.startsWith(b),
    '!startsWith': (a, b) => !a.startsWith(b),
    typeof: (a, b) => betterTypeof(a, b), // typeof a === b,
    '!typeof': (a, b) => !betterTypeof(a, b),
    arrayIsEqual: (a, b) => _.xor(a, b).length === 0,
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

const simpleSchemeTypeConversions = {
  Int: 'SimpleSchema.Integer',
  Float: 'Number',
  DateTime: 'Date',
  ObjectID: 'Mongo.ObjectID',
};

function cleanSimpleSchemeType(text) {
  clean = text.replace(/\[(\w+)\]/, '$1');

  if (simpleSchemeTypeConversions[clean]) {
    return simpleSchemeTypeConversions[clean];
  }
  return clean;
}

const cleanGraphqlTypeConversions = {
  Number: 'Float',
  '[Number]': '[Float]',
};

function cleanGraphqlType(text) {
  clean = text;

  if (cleanGraphqlTypeConversions[clean]) {
    return cleanGraphqlTypeConversions[clean];
  }
  return clean;
}

function apiDirCase(text) {
  return text
    .split('/')
    .map((item) => changeCase.pascalCase(item))
    .join('/');
}

function uiDirCase(text) {
  return text
    .split('/')
    .map((item) => changeCase.paramCase(item))
    .join('/');
}

module.exports = (plop) => {
  plop.setPrompt('jsonFile', jsonFilePath);
  plop.setPrompt('file', filePath);
  plop.setActionType('comment', comment);
  plop.setHelper('pluralize', (text) => pluralize(text));
  plop.setHelper('singular', (text) => pluralize.singular(text));
  plop.setHelper('compare', compare);
  plop.setHelper('log', (value) => console.log(value));
  plop.setHelper('stripBrackets', (text) => {
    return text.replace(/\[(\w+)\]/, '$1');
  });
  plop.setHelper('cleanSimpleSchemeType', cleanSimpleSchemeType);
  plop.setHelper('cleanGraphqlType', cleanGraphqlType);
  plop.setHelper('truncate', (text, prefix) => {
    const regEx = new RegExp(`^${prefix}(.*)`);
    return text.replace(regEx, '$1');
  });

  plop.setHelper('apiDirCase', apiDirCase);
  plop.setHelper('uiDirCase', uiDirCase);

  plop.setHelper('stripId', (text, idText) => {
    if (!(typeof idText === 'string')) {
      idText = 'Id';
    }
    const regEx = new RegExp(`^(.*)${idText}`);
    return text.replace(regEx, '$1');
  });

  plop.setHelper('concat', function() {
    arguments = [...arguments].slice(0, -1);
    return arguments.join('');
  });

  plop.setHelper('convertDataIndexToGraphqlSubQuery', convertDataIndexToGraphqlSubQuery);

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
