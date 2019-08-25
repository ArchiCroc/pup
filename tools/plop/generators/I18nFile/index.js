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
      message: 'What is your module name?',
      validate: requireField('name'),
    },
    {
      type: 'jsonFile',
      name: 'schema',
      message: 'Select a Schema to guide the module fields',
      basePath: './tools/plop/schemas',
    },
  ],
  actions: [
    {
      type: 'add',
      path: 'i18n/en/{{camelCase name}}.en.i18n.yml',
      templateFile: 'tools/plop/generators/I18nFile/en.i18n.yml.hbs',
    },
    {
      type: 'append',
      path: 'i18n/index.js',
      pattern: '/* #### PLOP_IMPORTS_START #### */',
      template: `import {{camelCase name}}EnI18n from './en/{{camelCase name}}.en.i18n.yml';`,
    },
  ],
};
