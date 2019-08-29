const { readdirSync, statSync } = require('fs');
const { join } = require('path');

const dirs = (p) => readdirSync(p).filter((f) => statSync(join(p, f)).isDirectory());

const regEx = /^(\w+)\(((?:\s*(?:\w+:\s*\w+),?)*)\):\s*(\w+)$/;

module.exports = {
  description: 'Add a query to an existing API Module',
  prompts: [
    {
      type: 'list',
      name: 'moduleName',
      message: 'Select an api module',
      choices: () => {
        return dirs('./api');
      },
    },
    {
      type: 'input',
      name: 'queryType',
      message: 'Query Type. Example: queryName(var1: Type1, var2: Type2): ReturnType\n',
      validate: (value) => regEx.test(value),
    },
  ],
  actions: (data) => {
    const queryParts = data.queryType.match(regEx);
    // data.queryName = queryParts[1];
    // data.queryParams = queryParts[2];
    // data.returnType = queryParts[3];
    // eslint-disable-next-line
    [, data.queryName, data.queryParams, data.returnType] = queryParts;

    return [
      {
        type: 'append',
        path: 'api/{{moduleName}}/queries.js',
        pattern: '/* #### PLOP_QUERIES_START #### */',
        templateFile: 'tools/plop/generators/AddGraphqlQuery/query.js.hbs',
        data,
      },
      {
        type: 'append',
        path: 'startup/server/graphql-api.js',
        pattern: '#### PLOP_QUERY_TYPES_START ####',
        template: `      {{queryType}}`,
        data,
      },
    ];
  },
};
