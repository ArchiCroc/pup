/* eslint-disable no-param-reassign */
const changeCase = require('change-case');
const pluralize = require('pluralize');

const defaultKeyMapping = {
  _id: undefined,
  email: 'mock-email',
  createdAtUTC: 'mock-far-past-date',
  updatedAtUTC: 'mock-near-past-date',
};

const defaultTypeMapping = {
  Boolean: 'mock-boolean',
  Int: 'mock-int',
  Float: 'mock-float',
  String: 'mock-text',
  DateTime: 'mock-near-past-date',
  Date: 'mock-near-past-date',
};

function pickFieldMock(item, data) {
  if (defaultKeyMapping.hasOwnProperty(item.key)) {
    return defaultKeyMapping[item.key];
  }

  if (item.choices) {
    return 'mock-choices';
  }

  if (item.key == 'createdBy') {
    if (data.schema.permissions.create === 'admin') {
      return 'mock-admin-user';
    }
    return 'mock-user';
  }
  if (item.key == 'updatedBy') {
    if (data.schema.permissions.update === 'admin') {
      return 'mock-admin-user';
    }
    return 'mock-user';
  }

  if (item.input === 'LongText') {
    return 'mock-long-text';
  }

  const itemType = item.type.replace('[', '').replace(']', '');

  if (defaultTypeMapping.hasOwnProperty(itemType)) {
    return defaultTypeMapping[itemType];
  }

  return undefined;
}

module.exports = pickFieldMock;
