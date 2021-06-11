import { adminRole, userRole, getPagePath } from '../../../../tests/helpers/e2e';

fixture`/admin/users`.page`http://localhost:3000/login`;

test('should allow users in admin role to access /admin/users', async (t) => {
  await t.useRole(adminRole).navigateTo('/admin/users');

  await t.expect(getPagePath()).eql('/admin/users');
});

test('should block users in users role from accessing /admin/users', async (t) => {
  await t.useRole(userRole).navigateTo('/admin/users');
  // make sure it redirects to home
  await t.expect(getPagePath()).eql('/');
});
