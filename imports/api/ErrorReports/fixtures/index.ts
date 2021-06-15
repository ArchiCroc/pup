import faker from 'faker';
import { ErrorReportFixture } from '/imports/common/ErrorReports/interfaces';

export function getInitialItems(): ErrorReportFixture[] {
  return [];
}

export function getMockItem(random: number, includeOptional = true): ErrorReportFixture {
  random = random || Math.floor(Math.random() * 1000);

  faker.seed(random);

  return {
    _id: undefined,
    user: {
      __crossReference: 'Users',
      query: 'users',
      edges: 'users',
      labelKey: 'fullName',
      valueKey: '_id',
      idType: 'String',
      variables: { roles: 'user' },
      key: 'userId',
      label: faker.helpers.randomize(['Test Admin01', 'Test User01', 'Test User02']),
    },
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
    createdAt: faker.date.past(10),
    createdBy: {
      __crossReference: 'Users',
      labelKey: 'fullName',
      valueKey: '_id',
      variables: { roles: 'user' },
      key: 'createdById',
      label: faker.helpers.randomize(['Test Admin01', 'Test User01', 'Test User02']),
    },
  };
}

export default { getInitialItems, getMockItem };
