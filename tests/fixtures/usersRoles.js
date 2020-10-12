import faker from 'faker';

export function getInitialItems() {
  return [];
}

export function getMockItem(random, includeOptional = true) {
  random = random || Math.floor(Math.random() * 1000);

  faker.seed(random);

  return {
    _id: undefined,
    name: faker.lorem.slug().substr(0, 64),
    createdAt: faker.date.past(10),
    createdBy: {
      __crossReference: 'Users',
      query: 'users',
      edges: 'users',
      labelKey: 'fullName',
      valueKey: '_id',
      idType: 'String',
      variables: { roles: 'user' },
      key: 'createdById',
      label: faker.helpers.randomize(['Test Admin01', 'Test User01', 'Test User02']),
    },
    updatedAt: faker.date.past(1),
    updatedBy: {
      __crossReference: 'Users',
      query: 'users',
      edges: 'users',
      labelKey: 'fullName',
      valueKey: '_id',
      idType: 'String',
      variables: { roles: 'user' },
      key: 'updatedById',
      label: faker.helpers.randomize(['Test Admin01', 'Test User01', 'Test User02']),
    },
  };
}

export default { getInitialItems, getMockItem };
