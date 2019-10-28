const changeCase = require('change-case');
// const listDirectories = require('../../libs/listDirectories');
const relativePath = require('../../libs/relativePath');

const regEx = /^(\w+)\(?((?:\s*(?:\w+:\s*\[?\w+\]?),?)*)\)?:\s*(\[?\w+\]?)$/;

module.exports = {
  description: 'Add a query to an existing API Module',
  prompts: [
    {
      type: 'file',
      name: 'apiFolderName',
      message: 'Select an api module',
      selectionType: 'folder',
      path: './api',
    },
    {
      type: 'input',
      name: 'queryType',
      message: 'Query Type. Example: queryName(var1: Type1, var2: Type2): ReturnType\n',
      validate: (value) => regEx.test(value),
    },
  ],
  actions: (data) => {
    data.apiFolderName = relativePath('./api', data.apiFolderName);
    const queryParts = data.queryType.match(regEx);
    // data.queryName = queryParts[1];
    // data.queryParams = queryParts[2];
    // data.returnType = queryParts[3];
    // eslint-disable-next-line
    [, data.queryName, data.queryParams, data.returnType] = queryParts;
    // eslint-disable-next-line
    data.queryParamSegments = data.queryParams.split(',').map((paramWithType) => {
      const parts = paramWithType.split(':').map((item) => item.trim());
      return { param: parts[0], type: parts[1] };
    });

    return [
      {
        type: 'append',
        path: 'api/{{apiFolderName}}/queries.js',
        pattern: '/* #### PLOP_QUERIES_START #### */',
        templateFile: 'tools/plop/generators/AddGraphqlQuery/templates/query.js.hbs',
        data,
      },
      {
        type: 'append',
        path: 'startup/server/graphql-api.js',
        pattern: `#### ${changeCase.constantCase(data.apiFolderName)}_QUERY_TYPES_START ####`,
        template: `      {{queryName}}{{#if queryParams}}({{#each queryParamSegments}}\${{param}}: {{type}}{{#unless @last}}, {{/unless}}{{/each}}){{/if}}: {{returnType}}`,
        data,
      },
      {
        type: 'comment',
        comment: `Example Query:
        
query {{queryName}}{{#if queryParams}}({{#each queryParamSegments}}\${{param}}: {{type}}{{#unless @last}}, {{/unless}}{{/each}}){{/if}} {
  {{queryName}}{{#if queryParams}}({{#each queryParamSegments}}{{param}}: \${{param}}{{#unless @last}}, {{/unless}}{{/each}}){{/if}}{
    ...{{ pascalCase (singular apiFolderName) }}Attributes
  }
}
      `,
        data,
      },
    ];
  },
};
