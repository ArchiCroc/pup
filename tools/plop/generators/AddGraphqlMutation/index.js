const listDirectories = require('../../lib/listDirectories');

const regEx = /^(\w+)\(((?:\s*(?:\w+:\s*\[?\w+\]?),?)+)\):\s*(\[?\w+\]?)$/;

module.exports = {
  description: 'Add a mutation to an existing API Module',
  prompts: [
    {
      type: 'list',
      name: 'moduleName',
      message: 'Select an api module',
      choices: () => {
        return listDirectories('./api');
      },
    },
    {
      type: 'input',
      name: 'mutationType',
      message: 'Mutation Type. Example: mutationName(var1: Type1, var2: Type2): ReturnType\n',
      validate: (value) => regEx.test(value),
    },
  ],
  actions: (data) => {
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
        path: 'api/{{moduleName}}/mutations.js',
        pattern: '/* #### PLOP_MUTATIONS_START #### */',
        templateFile: 'tools/plop/generators/AddGraphqlMutation/mutation.js.hbs',
        data,
      },
      {
        type: 'append',
        path: 'startup/server/graphql-api.js',
        pattern: '#### PLOP_MUTATION_TYPES_START ####',
        template: `      {{mutationType}}`,
        data,
      },
      {
        type: 'comment',
        comment: `Example Mutation:
        
mutation {{mutationName}}({{#each mutationParamSegments}}\${{param}}: {{type}}{{#unless @last}}, {{/unless}}{{/each}}) {
  {{mutationName}}({{#each mutationParamSegments}}{{param}}: \${{param}}{{#unless @last}}, {{/unless}}{{/each}}){
    ...{{ pascalCase (singular moduleName) }}Attributes
  }
}
      `,
      },
    ];
  },
};
