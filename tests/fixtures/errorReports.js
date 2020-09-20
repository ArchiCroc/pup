import faker from 'faker';

export function getInitialItems() {
  return [];
}

export function getMockItem(random, includeOptional = true) {
  random = random || Math.floor(Math.random() * 1000);

  faker.seed(random);

  return {
    _id: undefined,
    user: undefined,
    level: faker.helpers.randomize([0, 1, 2, 3, 4, 5]),
    message: faker.lorem.words().substr(0, 2048),
    path: faker.lorem.words().substr(0, 1024),
    userAgent: faker.lorem.words().substr(0, 1024),
    stack: Array.from(
      {
        length: faker.random.number({
          min: 1,
          max: 10,
        }),
      },
      () => faker.lorem.words(),
    ),
    reactStack: Array.from(
      {
        length: faker.random.number({
          min: 1,
          max: 10,
        }),
      },
      () => faker.lorem.words(),
    ),
    createdAtUTC: faker.date.past(10),
    createdBy: {
      __crossReference: 'Users',
      query: { roles: 'user' },
      key: 'createdById',
      displayValue: faker.helpers.randomize(['Test Admin01', 'Test User01', 'Test User02']),
    },
  };
}

export default { getInitialItems, getMockItem };
