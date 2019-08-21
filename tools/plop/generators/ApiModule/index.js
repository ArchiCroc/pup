const fs = require('fs');

const requireField = (fieldName) => {
  return (value) => {
    if (String(value).length === 0) {
      return `${fieldName} is required`;
    }
    return true;
  };
};

module.exports = {
  description: 'Create a new api module',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'What is your api module name?',
      validate: requireField('name'),
      filter(value) {
        console.log(value);
        return value;
      },
    },
    {
      type: 'filePath',
      name: 'schema',
      message: 'Select a Schema to guide the module fields',
      basePath: './tools/plop/schemas',
      filter(value) {
        const file = fs.readFileSync(`${value}`); // ./tools/plop/schemas/
        const output = JSON.parse(file);
        console.log(output);
        return output;
      },
    },
  ],
  actions: [
    {
      type: 'add',
      path: 'api/{{pascalCase name}}/types.js',
      templateFile: 'tools/plop/generators/ApiModule/templates/types.js.hbs',
    },
    // {
    //   type: 'add',
    //   path: 'ui/{{dashCase module}}/components/{{pascalCase name}}.test.js',
    //   templateFile: 'tools/plop/generators/Component/Component.test.js.hbs',
    // },
    // {
    //   type: 'add',
    //   path: 'ui/{{dashCase module}}/components/Styled{{pascalCase name}}.js',
    //   templateFile: 'tools/plop/generators/Component/StyledComponent.js.hbs',
    // },
    // {
    //   type: 'add',
    //   path: 'src/components/{{pascalCase name}}/index.js',
    //   templateFile: 'tools/plop/generators/Component/index.js.hbs',
    // },
    // {
    //   type: 'add',
    //   path: 'src/components/index.js',
    //   templateFile: 'tools/plop/template/injectable-index.js.hbs',
    //   skipIfExists: true,
    // },
    // {
    //   type: 'append',
    //   path: 'src/components/index.js',
    //   pattern: `/* PLOP_INJECT_IMPORT */`,
    //   template: `import {{pascalCase name}} from './{{pascalCase name}}';`,
    // },
    // {
    //   type: 'append',
    //   path: 'src/components/index.js',
    //   pattern: `/* PLOP_INJECT_EXPORT */`,
    //   template: `\t{{pascalCase name}},`,
    // },
  ],
};
