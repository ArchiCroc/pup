const processSchema = require('../../libs/processSchema');
const prettierTransform = require('../../libs/prettierTransform');

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
  actions: (promptData) => {
    const data = processSchema(promptData);
    return [
      {
        type: 'add',
        path: 'tests/fixtures/{{camelCase name}}.js',
        templateFile: 'tools/plop/generators/BasicFixtureFile/templates/fixture.js.hbs',
        transform: prettierTransform,
        data,
      },
      {
        type: 'append',
        path: 'startup/server/fixtures.js',
        pattern: '/* #### PLOP_IMPORTS_START #### */',
        template: `import {{camelCase name}}Fixtures from '../../tests/fixtures/{{camelCase name}}';`,
        data,
      },
      {
        type: 'append',
        path: 'startup/server/fixtures.js',
        pattern: '/* #### PLOP_IMPORTS_START #### */',
        template: `import {{ pascalCase pluralName }} from '../../api/{{ apiFolderName }}/{{ pascalCase pluralName }}';`,
        data,
      },
      {
        type: 'append',
        path: 'startup/server/fixtures.js',
        pattern: '/* #### PLOP_FIXTURE_START #### */',
        templateFile: 'tools/plop/generators/BasicFixtureFile/templates/seed.js.hbs',
        data,
      },
      {
        type: 'modify',
        path: 'startup/server/fixtures.js',
        transform: prettierTransform,
        data,
      },
    ];
  },
};
