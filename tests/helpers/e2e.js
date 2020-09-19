import { ClientFunction, Selector, Role } from 'testcafe';

export const serverUrl = 'http://localhost:3000';

export async function logout(browser) {
  console.log('logout');
  await browser.navigateTo('/logout'); //.wait(1); // clear current session
}

export async function login({ email, password, t }) {
  //await logout(browser)
  // console.log('load login page');
  // await Selector('[data-testid="user-nav-dropdown"]')();

  await t
    .typeText('[name="emailAddress"]', email)
    .typeText('[name="password"]', password)
    .click('button[type=submit]');
  console.log('login');
  await Selector('[data-testid="user-nav-dropdown"]')(); // NOTE: If this exists, users was logged in.
  console.log('login complete');
}

export const adminRole = Role(`${serverUrl}/login`, async (t) => {
  await login({
    email: 'admin@example.com',
    password: 'password',
    t,
  });
});

export const userRole = Role(`${serverUrl}/login`, async (t) => {
  await login({
    email: 'user01@example.com',
    password: 'password',
    t,
  });
});

export const anonymousRole = Role.anonymous();

export const getPagePath = ClientFunction(() => window.location.pathname);
export const getPageUrl = ClientFunction(() => window.location.href);
