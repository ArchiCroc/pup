import { Meteor } from 'meteor/meteor';
import seeder from '../../libs/seeder';
import userFixtures from '../../tests/fixtures/users';
/* #### PLOP_IMPORTS_START #### */
import UsersRoles from '../../api/Users/Roles/UsersRoles';
import usersRolesFixtures from '../../tests/fixtures/usersRoles';
/* #### PLOP_IMPORTS_END #### */

seeder(Meteor.users, {
  seedIfExistingData: false,
  environments: ['development', 'staging'],
  data: {
    static: userFixtures.getInitialItems(),
    dynamic: {
      count: 100,
      seed: userFixtures.getMockItem,
    },
  },
});

/* #### PLOP_FIXTURE_START #### */
/* #### USERS_ROLES_FIXTURES_START #### */
seeder(UsersRoles, {
  seedIfExistingData: false,
  environments: ['development', 'staging'],
  data: {
    static: usersRolesFixtures.getInitialItems(),
    dynamic: {
      count: 0,
      seed: usersRolesFixtures.getMockItem,
    },
  },
});
/* #### USERS_ROLES_FIXTURES_END #### */

/* #### PLOP_FIXTURE_END #### */

// // import Documents from '../../api/Documents/Documents';
// import Comments from '../../api/Comments/Comments';

// const commentsSeed = (userId, date, documentId) => {
//   seeder(Comments, {
//     seedIfExistingData: true,
//     environments: ['development', 'staging'],
//     data: {
//       dynamic: {
//         count: 3,
//         seed(commentIteration, faker) {
//           return {
//             userId,
//             documentId,
//             comment: faker.hacker.phrase(),
//             createdAt: date,
//           };
//         },
//       },
//     },
//   });
// };

// // const documentsSeed = (userId) => {
// //   seeder(Documents, {
// //     seedIfExistingData: true,
// //     environments: ['development', 'staging'],
// //     data: {
// //       dynamic: {
// //         count: 5,
// //         seed(iteration) {
// //           const date = new Date().toISOString();
// //           return {
// //             isPublic: false,
// //             createdAt: date,
// //             updatedAt: date,
// //             owner: userId,
// //             title: `Document #${iteration + 1}`,
// //             body: `This is the body of document #${iteration + 1}`,
// //             dependentData(documentId) {
// //               commentsSeed(userId, date, documentId);
// //             },
// //           };
// //         },
// //       },
// //     },
// //   });
// // };

// seeder(Meteor.users, {
//   seedIfExistingData: false,
//   environments: ['development', 'staging'],
//   data: {
//     static: [
//       {
//         email: 'admin@admin.com',
//         password: 'password',
//         profile: {
//           firstName: 'Andy',
//           lastName: 'Warhol',
//         },
//         roles: ['admin'],
//         // dependentData(userId) {
//         //   documentsSeed(userId);
//         // },
//       },
//     ],
//     dynamic: {
//       count: 100,
//       seed(iteration, faker) {
//         const userCount = iteration + 1;
//         return {
//           email: `user+${userCount}@test.com`,
//           password: 'password',
//           profile: {
//             firstName: faker.name.firstName(),
//             lastName: faker.name.lastName(),
//           },
//           roles: ['user'],
//           // dependentData(userId) {
//           //   documentsSeed(userId);
//           // },
//         };
//       },
//     },
//   },
// });
