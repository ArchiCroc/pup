import { ClientFunction, Selector } from 'testcafe';

export const login = async ({ email, password, browser }) => {
  console.log('logout');
  await browser.navigateTo('/logout'); //.wait(1); // clear current session
  console.log('load login page');
  // await Selector('[data-test="user-nav-dropdown"]')();
  await browser.navigateTo('/login');
  await browser.typeText('[name="emailAddress"]', email);
  await browser.typeText('[name="password"]', password);
  await browser.click('button[type=submit]');
  console.log('login');
  await Selector('[data-test="user-nav-dropdown"]')(); // NOTE: If this exists, users was logged in.
  console.log('login complete');
};

export const loginAsAdmin = async (browser) => {
  await login({
    email: 'admin@admin.com',
    password: 'password',
    browser,
  });
};

export const loginAsUser = async (browser) => {
  await login({
    email: 'user+1@test.com',
    password: 'password',
    browser,
  });
};

export const getPageUrl = ClientFunction(() => window.location.href);
