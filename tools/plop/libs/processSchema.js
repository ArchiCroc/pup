const changeCase = require('change-case');
const pluralize = require('pluralize');

function processFields(item, index) {
  if (item.permissions) {
    // eslint-disable-next-line
    for (let permissionKey in item.permissions) {
      const permission = item.permissions[permissionKey];
      if (typeof permission === 'string' && permission !== 'everyone') {
        item.permissions[permissionKey] = [permission];
      } else {
        // remove everyone, we will assume that none == everyone
        item.permissions[permissionKey] = !permission.includes('everyone') ? permission : undefined;
      }
    }
  }
  if (!item.dataIndex && item.reference && item.reference.labelField) {
    item.dataIndex = item.reference.labelField;
  }
  if (item.fields) {
    Object.values(item.fields).forEach(processFields);
  }
}

function processSchema(input) {
  const data = { ...input };

  const schema = data.schema || {};
  const schemaFields = schema.fields || {};
  const schemaFieldKeys = Object.keys(schemaFields);
  const schemaFieldValues = Object.values(schemaFields);

  data.fieldTypes = schemaFieldValues.map((item) => item.type);

  //if we don't have a manually set name, use the one from the schema
  if (!data.name) {
    data.name = schema.name;
  }

  // if a manual menu option is set, set that to default page
  if (data.menu) {
    schema.menu = schema.menu || {};
    schema.menu.index = data.menu;
  }

  // ensure permissions are an array of strings, if a single string is given, wrap it in an array
  const permissions = schema.permissions || {};
  permissions.read = permissions.read || 'everyone';
  permissions.create = permissions.create || permissions.save || 'everyone';
  permissions.update = permissions.update || permissions.save || 'everyone';
  permissions.delete = permissions.delete || 'everyone';
  // eslint-disable-next-line
  for (let permissionKey in permissions) {
    let permission = permissions[permissionKey];
    if (typeof permission === 'string') {
      permission = [permission];
    }
    permissions[permissionKey] = !permission.includes('everyone') ? permission : undefined;
  }

  schema.permissions = permissions;
  data.rawName = data.name;
  // turn collection/bigItem into Collection/BigItem
  data.apiFolderName = (schema.apiFolderName || data.rawName)
    .split('/')
    .map((folder) => changeCase.pascal(folder))
    .join('/');
  data.apiPathOffset = '../'.repeat(data.apiFolderName.split('/').length - 1);

  // turn collection/bigItem into collection/big-item
  data.uiFolderName = (schema.uiFolderName || data.rawName)
    .split('/')
    .map((folder) => changeCase.param(folder))
    .join('/');
  data.uiPathOffset = '../'.repeat(data.uiFolderName.split('/').length - 1);

  // clean the name. collection/bigItem into Collection/BigItem
  // if (data.rawName.includes('/')) {
  data.shortName = changeCase.pascal(data.rawName.split('/').pop());

  if (data.rawName.includes('/')) {
    data.name = data.rawName
      .split('/')
      .map((folder) => changeCase.pascal(folder))
      .join('/');
  }

  data.pluralName =
    schema.pluralName || pluralize.isPlural(data.name) ? data.name : pluralize(data.name);
  data.singularName =
    schema.singularName || pluralize.isSingular(data.name)
      ? data.name
      : pluralize.singular(data.name);

  data.shortPluralName =
    schema.shortPluralName || pluralize.isPlural(data.shortName)
      ? data.shortName
      : pluralize(data.shortName);

  data.shortSingularName =
    schema.shortSingularName || pluralize.isSingular(data.shortName)
      ? data.shortName
      : pluralize.singular(data.shortName);

  let primaryKeyIndex = schemaFieldValues.findIndex((field) => field.primaryKey);
  // if primary key isn't found, set it to the first key
  if (primaryKeyIndex === -1) {
    primaryKeyIndex = 0;
  }
  data.primaryFieldKey = schemaFieldKeys[primaryKeyIndex];
  data.primaryField = schemaFields[data.primaryFieldKey];

  let urlKeyIndex = schemaFieldValues.findIndex((field) => field.urlKey);
  // if primary key isn't found, set it to the primaryKey field
  if (urlKeyIndex === -1) {
    urlKeyIndex = primaryKeyIndex;
  }
  data.urlFieldKey = schemaFieldKeys[urlKeyIndex];
  data.urlField = schemaFields[data.urlFieldKey];

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
  data.labelFieldKey = schemaFieldKeys[labelKeyIndex];
  data.labelField = schemaFields[data.labelFieldKey];
  if (data.labelField.searchable !== false) {
    data.labelField.searchable = true;
  }

  data.isSearchable = !!schemaFieldValues.find((field) => field.searchable);
  data.isFilterable = !!schemaFieldValues.find((field) => field.filterable);
  data.hasGraphqlFilterable = !!schemaFieldValues.find(
    (field) => field.filterable && field.type === 'CrossReference',
  );

  // clean up field permissions
  data.hasFieldPermissions = schemaFieldValues.findIndex((field) => field.permissions) !== -1;
  // if (data.hasFieldPermissions) {
  schemaFieldValues.forEach(processFields);
  //}

  // stash these back to cover the case where they got built from scratch
  schema.fields = schemaFields;
  data.schema = schema;
  return data;
}

module.exports = processSchema;