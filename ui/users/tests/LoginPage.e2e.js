import { userRole, getPagePath } from '../../../tests/helpers/e2e';

fixture('/login').page('http://localhost:3000/login');

test('should allow users to login and see the home page', async (t) => {
  await t.useRole(userRole);

  await t.expect(getPagePath()).eql('/');
});
