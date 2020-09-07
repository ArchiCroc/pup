import { loginAsAdmin, loginAsUser, getPagePath } from '../../../tests/helpers/e2e';

fixture('/admin/users').page('http://localhost:3000/login');

test('should allow users in admin role to access /admin/users', async (browser) => {
  await loginAsAdmin(browser);

  await browser.navigateTo('/admin/users');
  await browser.expect(getPagePath()).eql('/admin/users');
});

test('should block users in users role from accessing /admin/users', async (browser) => {
  await loginAsUser(browser);

  await browser.navigateTo('/admin/users');
  await browser.expect(getPagePath()).eql('/');
});
