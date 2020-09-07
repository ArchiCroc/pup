import faker from 'faker';

export function getInitialItems() {
  return [];
}

export function getMockItem(random, includeOptional = true) {
  random = random || Math.floor(Math.random * 1000);

  faker.seed(random);

  return {
    _id: undefined,
    name: faker.lorem.words().substr(0, 64),
    createdAtUTC: faker.date.past(10),
    createdBy: {
      __crossReference: 'Users',
      query: { roles: 'user' },
      key: 'createdById',
      displayValue: faker.helpers.randomize(['Test Admin01', 'Test User01', 'Test User02']),
    },
    updatedAtUTC: faker.date.past(1),
    updatedBy: {
      __crossReference: 'Users',
      query: { roles: 'user' },
      key: 'updatedById',
      displayValue: faker.helpers.randomize(['Test Admin01', 'Test User01', 'Test User02']),
    },
  };
}

export default { getInitialItems, getMockItem };
