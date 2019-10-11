const changeCase = require('change-case');
const pluralize = require('pluralize');

function processSchema(input) {
  const data = { ...input };
  const schemaFieldKeys = Object.keys(data.schema.fields);
  const schemaFieldValues = Object.values(data.schema.fields);

  // ensure permissions are an array of strings, if a single string is given, wrap it in an array
  data.schema.permissions = data.schema.permissions || {};
  data.schema.permissions.read = data.schema.permissions.read || 'everyone';
  data.schema.permissions.save = data.schema.permissions.save || 'everyone';
  data.schema.permissions.delete = data.schema.permissions.delete || 'everyone';
  // eslint-disable-next-line
  for (let permissionKey in data.schema.permissions) {
    const permission = data.schema.permissions[permissionKey];
    if (typeof permission === 'string') {
      data.schema.permissions[permissionKey] = [permission];
    }
    data.schema.permissions[permissionKey] = !permission.includes('everyone')
      ? permission
      : undefined;
  }

  // turn collection/bigItem into Collection/BigItem
  data.apiFolderName = (data.schema.apiFolderName || data.name)
    .split('/')
    .map((folder) => changeCase.pascal(folder))
    .join('/');
  data.apiPathOffset = '../'.repeat(data.apiFolderName.split('/').length - 1);

  // turn collection/bigItem into collection/big-item
  data.uiFolderName = (data.schema.uiFolderName || data.name)
    .split('/')
    .map((folder) => changeCase.param(folder))
    .join('/');
  data.uiPathOffset = '../'.repeat(data.uiFolderName.split('/').length - 1);

  // clean the name. collection/bigItem into Collection/BigItem
  if (data.name.includes('/')) {
    data.name = data.name
      .split('/')
      .map((folder) => changeCase.pascal(folder))
      .join('');
  }

  data.pluralName =
    data.schema.pluralName || pluralize.isPlural(data.name) ? data.name : pluralize(data.name);
  data.singularName =
    data.schema.singularName || pluralize.isSingular(data.name)
      ? data.name
      : pluralize.singular(data.name);

  let primaryKeyIndex = schemaFieldValues.findIndex((field) => field.primaryKey);
  // if primary key isn't found, set it to the first key
  if (primaryKeyIndex === -1) {
    primaryKeyIndex = 0;
  }
  data.primaryKeyField = schemaFieldKeys[primaryKeyIndex];
  data.primaryKeyType = data.schema.fields[data.primaryKeyField].type || 'String';

  let urlKeyIndex = schemaFieldValues.findIndex((field) => field.urlKey);
  // if primary key isn't found, set it to the primaryKey field
  if (urlKeyIndex === -1) {
    urlKeyIndex = primaryKeyIndex;
  }
  data.urlKeyField = schemaFieldKeys[urlKeyIndex];
  data.urlKeyType = data.schema.fields[data.urlKeyField].type || 'String';

  const userKeyIndex = schemaFieldValues.findIndex((field) => field.userKey);
  // if primary key isn't found, set it to the primaryKey field
  if (userKeyIndex !== -1) {
    data.userKeyField = schemaFieldKeys[userKeyIndex];
  } else {
    data.userKeyField = 'createdById';
  }

  let labelKeyIndex = schemaFieldValues.findIndex((field) => field.labelKey);
  // if primary key isn't found, set it to the first field that is a string
  if (labelKeyIndex === -1) {
    labelKeyIndex = schemaFieldValues.findIndex((field) => field.type === 'String');
  }
  data.labelKeyField = schemaFieldKeys[labelKeyIndex];
  data.labelKeyType = data.schema.fields[data.labelKeyField].type || 'String';

  data.isSearchable = !!schemaFieldValues.find((field) => field.searchable);
  data.isFilterable = !!schemaFieldValues.find((field) => field.searchable);

  // clean up field permissions
  data.hasFieldPermissions = !!schemaFieldValues.findIndex((field) => field.permissions);
  if (data.hasFieldPermissions) {
    schemaFieldValues.forEach((item, index) => {
      if (item.permissions) {
        // eslint-disable-next-line
        for (let permissionKey in item.permissions) {
          const permission = item.permissions[permissionKey];
          if (typeof permission === 'string' && permission !== 'everyone') {
            item.permissions[permissionKey] = [permission];
          } else {
            // remove everyone, we will assume that none == everyone
            item.permissions[permissionKey] = !permission.includes('everyone')
              ? permission
              : undefined;
          }
        }
      }
    });
  }
  return data;
}

module.exports = processSchema;
