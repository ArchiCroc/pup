const changeCase = require('change-case');
const listDirectories = require('../../libs/listDirectories');
const relativePath = require('../../libs/relativePath');

const regEx = /^(\w+)\(?((?:\s*(?:\w+:\s*\[?\w+\]?),?)*)\)?:\s*(\[?\w+\]?)$/;

module.exports = {
  description: 'Add a mutation to an existing API Module',
  prompts: [
    {
      type: 'file',
      name: 'apiFolderName',
      message: 'Select an api module',
      selectionType: 'folder',
      path: './api',
    },
    {
      type: 'list',
      name: 'role',
      message: 'Access Permissions',
      choices: ['everyone', 'user', 'admin'],
      default: 'user',
    },
    {
      type: 'input',
      name: 'mutationType',
      message: 'Mutation Type. Example: mutationName(var1: Type1, var2: Type2): ReturnType\n',
      validate: (value) => regEx.test(value),
    },
    {
      type: 'list',
      name: 'template',
      message: 'Select an mutation template',
      choices: () => {
        return listDirectories('tools/plop/generators/AddGraphqlMutation/templates');
      },
    },
  ],
  actions: (data) => {
    data.apiFolderName = relativePath('./api', data.apiFolderName);
    const mutationParts = data.mutationType.match(regEx);
    // data.mutationName = mutationParts[1];
    // data.mutationParams = mutationParts[2];
    // data.returnType = mutationParts[3];
    // eslint-disable-next-line
    [, data.mutationName, data.mutationParams, data.returnType] = mutationParts;
    // eslint-disable-next-line
    data.mutationParamSegments = data.mutationParams.split(',').map((paramWithType) => {
      const parts = paramWithType.split(':').map((item) => item.trim());
      return { param: parts[0], type: parts[1] };
    });

    return [
      {
        type: 'append',
        path: 'api/{{apiDirCase apiFolderName}}/mutations.js',
        pattern: '/* #### PLOP_MUTATIONS_START #### */',
        templateFile:
          'tools/plop/generators/AddGraphqlMutation/templates/{{template}}/mutation.js.hbs',
        data,
      },
      {
        type: 'append',
        path: 'startup/server/graphql-api.js',
        pattern: `#### ${changeCase.constantCase(data.apiFolderName)}_MUTATION_TYPES_START ####`,
        template: `     {{mutationName}}{{#if mutationParams}}({{#each mutationParamSegments}}\${{param}}: {{type}}{{#unless @last}}, {{/unless}}{{/each}}){{/if}}: {{returnType}}`,
        data,
      },
      {
        type: 'comment',
        comment: `Example Mutation:
        
mutation {{mutationName}}{{#if mutationParamSegments}}({{#each mutationParamSegments}}\${{param}}: {{type}}{{#unless @last}}, {{/unless}}{{/each}}){{/if}} {
  {{mutationName}}({{#each mutationParamSegments}}{{param}}: \${{param}}{{#unless @last}}, {{/unless}}{{/each}}){
    ...{{ pascalCase (singular apiFolderName) }}Attributes
  }
}
      `,
        data,
      },
    ];
  },
};
