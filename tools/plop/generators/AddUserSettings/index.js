/* eslint-disable  */
const fs = require('fs');
const _ = require('lodash');

const requireField = (fieldName) => {
  return (value) => {
    if (String(value).length === 0) {
      return `${fieldName} is required`;
    }
    return true;
  };
};

const uniformsFields = [
  'Auto',
  'Bool',
  'Date',
  'Hidden',
  'List',
  'ListItem',
  'LongText',
  'Num',
  'Radio',
  'Select',
  'Submit',
  'Text',
];

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
    const schemaKeys = Object.keys(data.schema.fields);
    const schemaValues = Object.values(data.schema.fields);

    data.fieldImports = _.uniq(
      schemaValues.filter((field) => field.input).map((field) => field.input),
    ).map((field) => ({
      variable: `${field}Field`,
      path: uniformsFields.includes(field)
        ? `uniforms-antd/${field}Field`
        : `../components/${field}Field`,
    }));
    data.name = 'Users'; // ensure copied scripts are able to resolve the correct module

    return [
      {
        type: 'append',
        path: 'api/Users/schemas/user-settings.js',
        pattern: '/* #### PLOP_IMPORTS_START #### */',
        template: `{{#each schema.schemaImports }}
{{{this}}}
{{/each}}`,
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
{{/each}}`,
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
