const requireField = (fieldName) => {
  return (value) => {
    if (String(value).length === 0) {
      return `${fieldName} is required`;
    }
    return true;
  };
};

module.exports = {
  description: 'Create a reusable component',
  prompts: [
    {
      type: 'input',
      name: 'module',
      message: 'What UI Module Should it Be Added to?',
      validate: requireField('module'),
    },
    {
      type: 'input',
      name: 'name',
      message: 'What is your component name?',
      validate: requireField('name'),
    },
  ],
  actions: [
    {
      type: 'add',
      path: 'ui/{{dashCase module}}/components/{{pascalCase name}}.js',
      templateFile: 'tools/plop/generators/Component/Component.js.hbs',
    },
    {
      type: 'add',
      path: 'ui/{{dashCase module}}/components/{{pascalCase name}}.test.js',
      templateFile: 'tools/plop/generators/Component/Component.test.js.hbs',
    },
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
