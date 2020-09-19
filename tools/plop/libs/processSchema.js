/* eslint-disable no-param-reassign */
const changeCase = require('change-case');
const pluralize = require('pluralize');
const pickFieldMock = require('./pickFieldMock');

function processFields([key, item], data) {
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
  if (
    item.dataIndex === undefined &&
    item.reference &&
    item.reference.labelKey &&
    typeof item.reference.labelKey === 'string'
  ) {
    item.dataIndex = item.reference.labelKey;
  }
  if (item.fields) {
    Object.entries(item.fields).forEach((x) => processFields(x, data));
  }
  if (item.templateFile && !item.tableTemplateFile) {
    item.tableTemplateFile = item.templateFile;
  }
  if (item.templateFile && !item.detailTemplateFile) {
    item.detailTemplateFile = item.templateFile;
  }
  if (item.template && !item.tableTemplate) {
    item.tableTemplate = item.template;
  }
  if (item.template && !item.detailTemplate) {
    item.detailTemplate = item.template;
  }

  if (!item.tableTemplateFile && ['Date', 'DateTime', 'Time'].includes(item.type)) {
    item.tableTemplateFile = 'render-pretty-date';
  }
  if (!item.detailTemplateFile && ['Date', 'DateTime', 'Time'].includes(item.type)) {
    item.detailTemplateFile = 'render-format-date';
  }

  // if field is a groupKey, it should also be queryable
  // if (item.groupKey) {
  //   item.queryable = 'single';
  // }

  // if (item.groupKey) {
  //   item.queryable = 'single';
  // }
  // this is so we can always get the reference field name to use in the queries
  // perhaps we should always exand input so it's always an object?
  item.key = key;
  if (item.input && item.input.name) {
    item.fieldName = item.input.name;
  } else {
    item.fieldName = key;
  }
  if (item.input && item.input.type) {
    item.fieldType = item.input.type;
  } else {
    item.fieldType = item.type;
  }

  // set default filter for value that are true so it matches a template
  if (item.filterable === true && !item.filterTemplateFile) {
    item.filterTemplateFile = item.fieldType === 'Boolean' ? 'filter-boolean' : 'filter-default';
  } else if (typeof item.filterable === 'string') {
    item.filterTemplateFile = `filter-${item.filterable}`;
    item.filterable = true;
  } else if (item.filterable !== true) {
    item.filterable = false;
  }

  // make sure default for showInTableView is set
  if (item.showInTableView === undefined) {
    item.showInTableView = true;
  }
  if (typeof item.showInTableView === 'string') {
    item.tableLabel = item.showInTableView;
    item.showInTableView = true;
  }

  // make sure default for showInDetailView is set
  if (item.showInDetailView === undefined) {
    item.showInDetailView = true;
  }
  if (typeof item.showInDetailView === 'string') {
    item.detailLabel = item.showInDetailView;
    item.showInDetailView = true;
  }

  //clean up mock data
  if (!item.mockTemplateFile && (!item.mock || !item.mock.template)) {
    item.mockTemplateFile = pickFieldMock(item, data);
  }

  // process input field
  if (item.input && item.input.input) {
    item.inputField = item.input.input;
  } else if (typeof item.input === 'string') {
    item.inputField = item.input;
  }

  //input template
  if (item.input && item.inputField && !item.inputTemplateFile && !item.input.template) {
    item.inputTemplateFile = `input-${changeCase.pathCase(item.inputField)}`;
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
    .filter((folder) => folder !== '')
    .join('/');
  data.uiPathOffset = '../'.repeat(data.uiFolderName.split('/').length - 1);

  // set the uiRouteBasePath fromthe foldername if it blank
  data.uiRouteBasePath = schema.uiRouteBasePath || `/${data.uiFolderName}`;

  // make uiRouteBasePath starts with a slash
  if (!data.uiRouteBasePath.startsWith('/')) {
    data.uiRouteBasePath = `/${data.uiRouteBasePath}`;
  }

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
    schema.pluralName !== undefined
      ? schema.pluralName
      : pluralize.isPlural(data.name)
      ? data.name
      : pluralize(data.name);

  data.singularName =
    schema.singularName !== undefined
      ? schema.singularName
      : pluralize.isSingular(data.name)
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

  data.collectionName = schema.collectionName || data.pluralName;

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

  // const groupKeyIndex = schemaFieldValues.findIndex((field) => field.groupKey);
  // // if primary key isn't found, set it to the primaryKey field
  // if (groupKeyIndex !== -1) {
  //   data.groupKeyField = schemaFieldKeys[groupKeyIndex];
  //   data.groupField = schemaFields[data.groupKeyField];
  // } else {
  //   // I don't think we need to set a default, unefined is fine
  //   // data.groupKeyField = 'parentId';
  // }

  // Process each entry
  Object.entries(schemaFields).forEach((x) => processFields(x, data));

  let labelKeyIndex = schemaFieldValues.findIndex((field) => field.labelKey);
  // if primary key isn't found, set it to the first field that is a string
  if (labelKeyIndex === -1) {
    labelKeyIndex = schemaFieldValues.findIndex(
      (field) => field.fieldType === 'String' && field.key !== '_id',
    );
    if (labelKeyIndex === -1) {
      throw new Error(
        "A Valid Label key wasn't found. Update your Schema or try a different plop template",
      );
    }
  }
  data.labelFieldKey = schemaFieldKeys[labelKeyIndex];
  data.labelField = schemaFields[data.labelFieldKey];
  if (data.labelField && data.labelField.searchable !== false) {
    data.labelField.searchable = true;
  }

  data.isSearchable = !!schemaFieldValues.find((field) => field.searchable);
  data.isFilterable = !!schemaFieldValues.find((field) => field.filterable);
  // data.hasGraphqlFilterable = !!schemaFieldValues.find(
  //   (field) => field.filterable && field.reference,
  // );

  // clean up field permissions
  data.hasFieldPermissions = schemaFieldValues.findIndex((field) => field.permissions) !== -1;
  // if (data.hasFieldPermissions) {

  //}

  // stash these back to cover the case where they got built from scratch
  schema.fields = schemaFields;
  data.schema = schema;
  return data;
}

module.exports = processSchema;
