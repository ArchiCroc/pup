const requireField = (fieldName) => {
  return (value) => {
    if (String(value).length === 0) {
      return `${fieldName} is required`;
    }
    return true;
  };
};

module.exports = {
  description: 'Create an i18n file for a Basic Module from a predefined Schema',
  prompts: async (inquirer) => {
    const values = await inquirer.prompt({
      type: 'jsonFile',
      name: 'schema',
      message: 'Select a Schema to guide the module fields',
      basePath: './tools/plop/schemas',
    });
    const name = await inquirer.prompt({
      default: values.schema.name || null,
      type: 'input',
      name: 'name',
      message: 'What is your module name?',
      validate: requireField('name'),
    });
    Object.assign(values, name);
    return values;
  },
  actions: [
    {
      type: 'add',
      path: 'i18n/en/{{camelCase name}}.en.i18n.yml',
      templateFile: 'tools/plop/generators/BasicI18nFile/en.i18n.yml.hbs',
    },
    {
      type: 'append',
      path: 'i18n/index.js',
      pattern: '/* #### PLOP_IMPORTS_START #### */',
      template: `import {{camelCase name}}EnI18n from './en/{{camelCase name}}.en.i18n.yml';`,
    },
  ],
};
