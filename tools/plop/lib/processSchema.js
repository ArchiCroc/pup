import changeCase from 'change-case';
import pluralize from 'pluralize';

function processSchema(input) {
  const data = input;
  const schemaKeys = Object.keys(data.schema.fields);
  const schemaValues = Object.values(data.schema.fields);

  // turn collection/bigItem into Collection/BigItem
  data.apiFolderName = (data.schema.apiFolderName || data.name)
    .split('/')
    .map((folder) => changeCase.pascal(folder))
    .join('/');

  // turn collection/bigItem into collection/big-item
  data.uiFolderName = (data.schema.uiFolderName || data.name)
    .split('/')
    .map((folder) => changeCase.param(folder))
    .join('/');

  // clean the name. collection/bigItem into Collection/BigItem
  if (data.name.includes('/')) {
    data.name
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

  let primaryKeyIndex = schemaValues.findIndex((field) => field.primaryKey);
  // if primary key isn't found, set it to the first key
  if (primaryKeyIndex === -1) {
    primaryKeyIndex = 0;
  }
  data.primaryKeyField = schemaKeys[primaryKeyIndex];
  data.primaryKeyType = data.schema.fields[data.primaryKeyField].type || 'String';

  let urlKeyIndex = schemaValues.findIndex((field) => field.urlKey);
  // if primary key isn't found, set it to the primaryKey field
  if (urlKeyIndex === -1) {
    urlKeyIndex = primaryKeyIndex;
  }
  data.urlKeyField = schemaKeys[urlKeyIndex];
  data.urlKeyType = data.schema.fields[data.urlKeyField].type || 'String';

  const userKeyIndex = schemaValues.findIndex((field) => field.userKey);
  // if primary key isn't found, set it to the primaryKey field
  if (userKeyIndex !== -1) {
    data.userKeyField = schemaKeys[userKeyIndex];
  } else {
    data.userKeyField = 'createdById';
  }

  let labelKeyIndex = schemaValues.findIndex((field) => field.labelKey);
  // if primary key isn't found, set it to the first field that is a string
  if (labelKeyIndex === -1) {
    labelKeyIndex = schemaValues.findIndex((field) => field.type === 'String');
  }
  data.labelKeyField = schemaKeys[labelKeyIndex];
  data.labelKeyType = data.schema.fields[data.labelKeyField].type || 'String';

  data.isSearchable = !!schemaValues.find((field) => field.searchable);
  data.isFilterable = !!schemaValues.find((field) => field.searchable);

  return data;
}

module.exports = processSchema;
