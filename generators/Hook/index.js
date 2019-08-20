const requireField = (fieldName) => {
  return (value) => {
    if (String(value).length === 0) {
      return `${fieldName} is required`;
    }
    return true;
  };
};

module.exports = {
  description: 'Create a custom react hook',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'What is your hook name?',
      validate: requireField('name'),
    },
  ],
  actions: [
    {
      type: 'add',
      path: 'src/hooks/{{camelCase name}}.js',
      templateFile: 'plop-templates/hook.js.hbs',
    },
    {
      type: 'add',
      path: 'src/hooks/index.js',
      templateFile: 'plop-templates/injectable-index.js.hbs',
      skipIfExists: true,
    },
    {
      type: 'append',
      path: 'src/hooks/index.js',
      pattern: `/* PLOP_INJECT_IMPORT */`,
      template: `import {{camelCase name}} from './{{camelCase name}}';`,
    },
    {
      type: 'append',
      path: 'src/hooks/index.js',
      pattern: `/* PLOP_INJECT_EXPORT */`,
      template: `\t{{camelCase name}},`,
    },
  ],
};
