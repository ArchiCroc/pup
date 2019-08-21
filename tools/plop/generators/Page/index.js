const requireField = (fieldName) => {
  return (value) => {
    if (String(value).length === 0) {
      return `${fieldName} is required`;
    }
    return true;
  };
};

module.exports = {
  description: 'Create a page',
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
      message: 'What is your page name?',
      validate: requireField('name'),
    },
  ],
  actions: [
    {
      type: 'add',
      path: 'ui/{{dashCase module}}/{{pascalCase name}}.js',
      templateFile: 'generators/Page/Page.js.hbs',
    },
    {
      type: 'add',
      path: 'ui/{{dashCase module}}/{{pascalCase name}}.test.js',
      templateFile: 'generators/Page/Page.test.js.hbs',
    },
    {
      type: 'add',
      path: 'ui/{{dashCase module}}/Styled{{pascalCase name}}.js',
      templateFile: 'generators/Page/StyledPage.js.hbs',
    },
    {
      type: 'add',
      path: 'src/pages/{{pascalCase name}}/index.js',
      templateFile: 'generators/Page/index.js.hbs',
    },
    // {
    //   type: 'add',
    //   path: 'src/pages/index.js',
    //   templateFile: 'plop-templates/injectable-index.js.hbs',
    //   skipIfExists: true,
    // },
    // {
    //   type: 'append',
    //   path: 'src/pages/index.js',
    //   pattern: `/* PLOP_INJECT_IMPORT */`,
    //   template: `import {{pascalCase name}} from './{{pascalCase name}}';`,
    // },
    // {
    //   type: 'append',
    //   path: 'src/pages/index.js',
    //   pattern: `/* PLOP_INJECT_EXPORT */`,
    //   template: `\t{{pascalCase name}},`,
    // },
  ],
};
