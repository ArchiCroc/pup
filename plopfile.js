const pluralize = require('pluralize');
const changeCase = require('change-case');
const jsonFilePath = require('inquirer-parse-json-file'); // require('inquirer-file-tree-selection-prompt'); //
const filePath = require('inquirer-file-selector-prompt');
const _ = require('lodash');
const Handlebars = require('handlebars');

const { readdirSync, statSync, readFileSync } = require('fs');
const { join } = require('path');

const dirs = (p) => readdirSync(p).filter((f) => statSync(join(p, f)).isDirectory());
const files = (p) => readdirSync(p).filter((f) => statSync(join(p, f)).isFile());

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
    startsWith: (a, b) => a && a.startsWith(b),
    '!startsWith': (a, b) => a && !a.startsWith(b),
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

function ifPartialHasValue(value, opts) {
  let isTrue = false;

  if (typeof value === 'function' && value(this).trim() !== '') {
    // console.log('ifPartialHasValue', value, typeof value(), value(this), opts);
    isTrue = true;
  }

  return isTrue ? opts.fn(this) : opts.inverse(this);
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

function convertParamsToTemplateVars(text) {
  return text
    .split('/')
    .map((item) => (item.startsWith(':') ? '${' + item.replace(':', '') + '}' : item))
    .join('/');
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

function mongoCollectionCase(text) {
  return text
    .split('/')
    .map((item) => changeCase.camelCase(item))
    .join('_');
}

function pathOffset(text) {
  return '../'.repeat(text.split('/').length - 1);
}

function lastUrlSegment(text) {
  return text.split('/').pop();
}

function quoteIfString(text) {
  if (typeof text === 'string') {
    const string = Handlebars.Utils.escapeExpression(text);
    return new Handlebars.SafeString(`'${string}'`); // mark as already escaped
  }
  if (typeof text === 'boolean') {
    return text === true ? 'true' : 'false';
  }
  return text;
}

const importRegex = /^import (?:([A-Za-z0-9_-]*),? )?(?:\{(.*)\} )?from ['"](\S+)['"];?.*$/gm;

function objectToImportString(i) {
  const parts = ['import'];
  if (i.moduleVar) {
    parts.push(i.moduleVar + (i.memberVars.length > 0 ? ',' : ''));
  }
  if (i.memberVars.length) {
    parts.push('{');
    parts.push(i.memberVars.sort().join(', '));
    parts.push('}');
  }
  parts.push('from');
  parts.push(`'${i.module}';`);
  return parts.join(' ');
}
function uniqueImports(options) {
  const contents = options.fn(this);
  // }
  // function uniqueImportsTest(contents) {
  let imports = contents.matchAll(importRegex);
  const modules = {};
  const moduleImports = [];
  const localImports = [];
  const finalImports = [];

  for (const i of imports) {
    //imports.forEach((i) => { //this ins't supported in node 12 :(
    const moduleVar = i[1];
    const memberVars = i[2];
    const module = i[3];

    if (!modules[module]) {
      modules[module] = { module, memberVars: [] };
    }
    if (memberVars) {
      const parts = memberVars.split(/,\s*?/).map((i) => i.trim());
      modules[module].memberVars.push(...parts);
    }
    if (moduleVar) {
      modules[module].moduleVar = moduleVar;
    }
  }
  //);
  Object.values(modules).forEach((i) => {
    i.memberVars = _.uniq(i.memberVars);
    if (i.module.startsWith('.')) {
      localImports.push(i);
    } else {
      moduleImports.push(i);
    }
  });
  _.sortBy(moduleImports, (i) => i.module).forEach((i) => {
    finalImports.push(objectToImportString(i));
  });
  _.sortBy(localImports, (i) => i.module).forEach((i) => {
    finalImports.push(objectToImportString(i));
  });

  return finalImports.join('\n');
}

const templateLiteralRegex = /\${.*}/gm;

function quoteString(options) {
  const contents = options.fn(this);
  // }
  // function uniqueImportsTest(contents) {
  let match = contents.match(templateLiteralRegex);
  if (match) {
    return '`' + contents + '`';
  }

  return `'${contents}'`;
}

function quoteStringForJSX(options) {
  const contents = options.fn(this);
  // }
  // function uniqueImportsTest(contents) {
  let match = contents.match(templateLiteralRegex);
  if (match) {
    return '{`' + contents + '`}';
  }

  return `"${contents}"`;
}

function prettyProps(maxStringLength, options) {
  if (!options) {
    options = maxStringLength;
    maxStringLength = 60;
  }

  const contents = options.fn(this);

  const props = _.uniq(_.compact(contents.split(',').map(_.trim))).sort();

  if (props.length === 0) {
    return '';
  }

  //trim ...props if it's the only item
  if (props.length === 1 && props[0].startsWith('...')) {
    return props[0].replace('...', '');
  }

  // make sure ...props is last since alphabetically it comes first
  if (props[0].startsWith('...')) {
    const first = props.shift();
    props.push(first);
  }

  let result = ` ${props.join(', ')} `;
  if (result.length > maxStringLength) {
    result = `\n  ${
      props.join(',\n  ') + (props[props.length - 1].startsWith('...') ? '' : ',')
    } \n`;
  }
  return `{${result}}`;
}

// const testImports = `import some-Module, { someMember3 } from '../../someModule';
// import { someMember2 } from 'someModule';
// import { someMember} from 'someModule';
// import someModule from 'myModule';
// import { List} from 'react-router' `;

// console.log(uniqueImportsTest(testImports));

function render(text, options) {
  const renderedString = plop.renderString('text', options.data);
  return Handlebars.Utils.escapeExpression(renderedString);
}

module.exports = (plop) => {
  plop.setPrompt('jsonFile', jsonFilePath);
  plop.setPrompt('file', filePath);
  plop.setActionType('comment', comment);
  plop.setHelper('render', render);
  plop.setHelper('pluralize', (text) => pluralize(text));
  plop.setHelper('singular', (text) => pluralize.singular(text));
  plop.setHelper('compare', compare);
  plop.setHelper('ifPartialHasValue', ifPartialHasValue);
  plop.setHelper('log', (value) => console.log(value));
  plop.setHelper('stripBrackets', (text) => {
    if (typeof text === 'string') {
      return text.replace(/\[(\w+)\]/, '$1');
    }
    return text;
  });
  plop.setHelper('cleanSimpleSchemeType', cleanSimpleSchemeType);
  plop.setHelper('cleanGraphqlType', cleanGraphqlType);
  plop.setHelper('truncate', (text, prefix) => {
    if (typeof text === 'string') {
      const regEx = new RegExp(`^${prefix}(.*)`);
      return text.replace(regEx, '$1');
    }
    return text;
  });
  plop.setHelper('quoteIfString', quoteIfString);
  plop.setHelper('convertParamsToTemplateVars', convertParamsToTemplateVars);
  plop.setHelper('apiDirCase', apiDirCase);

  plop.setHelper('uiDirCase', uiDirCase);
  plop.setHelper('mongoCollectionCase', mongoCollectionCase);
  plop.setHelper('pathOffset', pathOffset);
  plop.setHelper('lastUrlSegment', lastUrlSegment);
  plop.setHelper('short', lastUrlSegment);

  plop.setHelper('stripId', (text, idText) => {
    if (!(typeof idText === 'string')) {
      idText = 'Id';
    }
    if (typeof text === 'string') {
      const regEx = new RegExp(`^(.*)${idText}`);
      return text.replace(regEx, '$1');
    }
    return text;
  });

  plop.setHelper('concat', function () {
    arguments = [...arguments].slice(0, -1);
    return arguments.join('');
  });

  plop.setHelper('convertDataIndexToGraphqlSubQuery', convertDataIndexToGraphqlSubQuery);
  plop.setHelper('uniqueImports', uniqueImports);
  plop.setHelper('quoteString', quoteString);
  plop.setHelper('quoteStringForJSX', quoteStringForJSX);
  plop.setHelper('prettyProps', prettyProps);

  const generators = dirs('./tools/plop/generators');

  generators.forEach((folder) => {
    // this is kinda dangerous but I think this is the best solution
    // eslint-disable-next-line
    const object = require(`./tools/plop/generators/${folder}`);
    plop.setGenerator(folder, object);
  });

  const partials = files('./tools/plop/templates');
  partials.forEach((partialFileName) => {
    // this is kinda dangerous but I think this is the best solution
    // eslint-disable-next-line
    const name = partialFileName.split('.').shift();

    const contents = readFileSync(`./tools/plop/templates/${partialFileName}`, 'utf8');
    plop.setPartial(name, contents);
  });

  // plop.setGenerator('Add Basic Module', basicModuleGenerator);
  // plop.setGenerator('API Module', apiModuleGenerator);
  // plop.setGenerator('UI Module', uiModuleGenerator);
  // plop.setGenerator('Component', componentGenerator);
  // plop.setGenerator('Page', pageGenerator);
  // plop.setGenerator('Hook', hookGenerator);
  // plop.setGenerator('I18n File', i18nFileGenerator);
};
