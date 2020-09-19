// import { Meteor } from 'meteor/meteor';
import faker from 'faker';
// import seeder from '../../libs/seeder'

const mockItemCount = 100;

export function getInitialItems() {
  return [
    {
      email: 'admin@example.com',
      password: 'password',
      profile: {
        firstName: 'Andy',
        lastName: 'Warhol',
      },
      roles: ['admin'],
    },
    {
      email: 'user01@example.com',
      password: 'password',
      profile: {
        firstName: 'Test',
        lastName: 'User01',
      },
      roles: ['user'],
    },
    {
      email: 'user02@example.com',
      password: 'password',
      profile: {
        firstName: 'Test',
        lastName: 'User02',
      },
      roles: ['user'],
    },
  ];
}

export function getMockItem(random) {
  random = random || Math.floor(Math.random() * 1000);

  faker.seed(random);

  const profile = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
  };

  return {
    email: faker.internet.exampleEmail(profile.firstName, profile.lastName + random),
    password: faker.internet.password(),
    profile,
    roles: ['user'],
  };
}

export default { getInitialItems, getMockItem };
