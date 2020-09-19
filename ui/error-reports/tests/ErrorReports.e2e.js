import { loginAsAdmin, login, loginAsUser, getPageUrl } from '../../../tests/helpers/e2e';

fixture('Test ErrorReports').page('http://localhost:3000');

// test('should allow users in admin role to access /admin/error-reports', async (browser) => {
//   //await loginAsAdmin(browser);
//   await login({
//     email: 'admin@admin.com',
//     password: 'password',
//     browser,
//   });

//   await browser.navigateTo('/admin/error-reports');
//   await browser.expect(getPageUrl()).contains('/admin/error-reports');
// });

// test('should block users in users role from accessing /admin/error-reports', async (browser) => {
//   await loginAsUser(browser);

//   await browser.navigateTo('/admin/error-reports');
//   await browser.expect(getPageUrl()).eql('http://localhost:3000/');
// });
