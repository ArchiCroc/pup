/* eslint-disable  */
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
  description: 'Add User Settings from a schema',
  prompts: [
    {
      type: 'jsonFile',
      name: 'schema',
      message: 'Select a Schema of fields to add',
      basePath: './tools/plop/schemas',
    },
  ],
  actions: (data) => {
    const schemaKeys = Object.keys(data.schema);
    const schemaValues = Object.values(data.schema);

    data.fieldImports = _.uniq(
      schemaValues.filter((field) => field.input).map((field) => field.input),
    ).map((field) => ({
      variable: `${field}Field`,
      path: uniformsFields.includes(field)
        ? `uniforms-antd/${field}Field`
        : `../components/${field}Field`,
    }));

    let primaryKeyIndex = schemaValues.findIndex((field) => field.primaryKey);
    // if primary key isn't found, set it to the first key
    if (primaryKeyIndex === -1) {
      primaryKeyIndex = 0;
    }
    data.primaryKeyField = schemaKeys[primaryKeyIndex];
    data.primaryKeyType = data.schema[data.primaryKeyField].type || 'String';

    let urlKeyIndex = schemaValues.findIndex((field) => field.urlKey);
    // if primary key isn't found, set it to the primaryKey field
    if (urlKeyIndex === -1) {
      urlKeyIndex = primaryKeyIndex;
    }
    data.urlKeyField = schemaKeys[urlKeyIndex];
    data.urlKeyType = data.schema[data.urlKeyField].type || 'String';

    let userKeyIndex = schemaValues.findIndex((field) => field.userKey);
    // if primary key isn't found, set it to the primaryKey field
    if (userKeyIndex !== -1) {
      data.userKeyField = schemaKeys[userKeyIndex];
    } else {
      data.userKeyField = 'createdById';
    }

    return [
      {
        type: 'append',
        path: 'api/Users/schemas/user-settings.js',
        pattern: '/* #### PLOP_IMPORTS_START #### */',
        template: `{{#each schema.schemaImports }}
{{{this}}}
{{~/each}}`,
      },
      {
        type: 'append',
        path: 'api/Users/schemas/user-settings.js',
        pattern: '/* #### PLOP_SCHEMA_START #### */',
        templateFile: 'tools/plop/generators/AddUserSettings/templates/user-settings.js.hbs',
      },
      {
        type: 'append',
        path: 'i18n/en/users.en.i18n.yml',
        pattern: '#### PLOP_FIELDS_START ####',
        templateFile: 'tools/plop/generators/AddUserSettings/templates/en.i18n.yml.hbs',
      },

      {
        type: 'append',
        path: 'api/Users/types.js',
        pattern: '#### PLOP_USER_SETTINGS_GDPR_INPUT_START ####',
        template: `{{#each schema.fields }}
{{~#compare this.type '&&' this.input '&&' @key 'startsWith' 'gdpr'}}
    {{truncate @key 'gdpr.'}}: {{this.type}}{{#compare this.validate.optional '==' undefined '||' this.validate.optional '==' false}}{{#compare this.defaultValue '==' undefined}}!{{/compare}}{{/compare}}
{{/compare~}}
{{/each~}}`,
      },
      {
        type: 'append',
        path: 'api/Users/types.js',
        pattern: '#### PLOP_USER_SETTINGS_INPUT_START ####',
        template: `{{#each schema.fields }}
{{~#compare this.type '&&' this.input '&&' @key '!startsWith' 'gdpr'}}
    {{@key}}: {{this.type}}{{#compare this.validate.optional '==' undefined '||' this.validate.optional '==' false}}{{#compare this.defaultValue '==' undefined}}!{{/compare}}{{/compare}}
{{/compare~}}
{{/each~}}`,
      },
      {
        type: 'append',
        path: 'api/Users/types.js',
        pattern: '#### PLOP_USER_SETTINGS_GDPR_TYPE_START ####',
        template: `{{#each schema.fields ~}}
{{~#if this.type}}
{{#compare @key 'startsWith' 'gdpr'}}
    {{truncate @key 'gdpr.'}}: {{this.type}}
{{/compare}}
{{/if~}}
{{~/each}}`,
      },
      {
        type: 'append',
        path: 'api/Users/types.js',
        pattern: '#### PLOP_USER_SETTINGS_TYPE_START ####',
        template: `{{#each schema.fields ~}}
{{~#if this.type}}
{{#compare @key '!startsWith' 'gdpr'}}
    {{@key}}: {{this.type}}
{{/compare}}
{{/if~}}
{{~/each}}`,
      },
      {
        type: 'append',
        path: 'ui/users/components/UserSettings.jsx',
        pattern: '/* #### PLOP_IMPORTS_START #### */',
        template: `{{#each fieldImports}}
import {{this.variable}} from '{{this.path}}';
{{~/each}}`,
      },
      {
        type: 'append',
        path: 'ui/users/components/UserSettings.jsx',
        pattern: '{/* #### PLOP_FIELDS_START #### */}',
        templateFile: 'tools/plop/generators/AddUserSettings/templates/fields.js.hbs',
      },
      {
        type: 'append',
        path: 'ui/users/queries/Users.gql',
        pattern: '#### PLOP_USER_SETTINGS_GDPR_START ####',
        template: `{{#each schema.fields ~}}
{{~#if this.type}}
{{#compare @key 'startsWith' 'gdpr.'}}
      {{truncate @key 'gdpr.'}}
{{/compare}}
{{/if~}}
{{~/each}}`,
      },
      {
        type: 'append',
        path: 'ui/users/queries/Users.gql',
        pattern: '#### PLOP_USER_SETTINGS_START ####',
        template: `{{#each schema.fields ~}}
{{~#if this.type}}
{{#compare @key '!startsWith' 'gdpr'}}
    {{@key}}
{{/compare}}
{{/if~}}
{{~/each}}`,
      },
      {
        type: 'append',
        path: 'ui/users/fragments/Users.gql',
        pattern: '#### PLOP_USER_SETTINGS_GDPR_START ####',
        template: `{{#each schema.fields ~}}
{{~#if this.type}}
{{#compare @key 'startsWith' 'gdpr.'}}
      {{truncate @key 'gdpr.'}}
{{/compare}}
{{/if~}}
{{~/each}}`,
      },
      {
        type: 'append',
        path: 'ui/users/fragments/Users.gql',
        pattern: '#### PLOP_USER_SETTINGS_START ####',
        template: `{{#each schema.fields ~}}
{{~#if this.type}}
{{#compare @key '!startsWith' 'gdpr'}}
    {{@key}}
{{/compare}}
{{/if~}}
{{~/each}}`,
      },
    ];
  },
};
