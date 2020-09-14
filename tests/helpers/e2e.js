import { ClientFunction, Selector } from 'testcafe';

export const serverUrl = 'http://localhost:3000';

export async function logout(browser) {
  console.log('logout');
  await browser.navigateTo('/logout');//.wait(1); // clear current session
}

export async function login({ email, password, browser }) {
  await logout(browser)
  console.log('load login page');
  // await Selector('[data-testid="user-nav-dropdown"]')();
  await browser.navigateTo('/login');
  await browser.typeText('[name="emailAddress"]', email);
  await browser.typeText('[name="password"]', password);
  await browser.click('button[type=submit]');
  console.log('login');
  await Selector('[data-testid="user-nav-dropdown"]')(); // NOTE: If this exists, users was logged in.
  console.log('login complete');
};

export async function loginAsAdmin(browser) {
  await login({
    email: 'admin@example.com',
    password: 'password',
    browser,
  });
};

export async function loginAsUser (browser) {
  await login({
    email: 'user01@example.com',
    password: 'password',
    browser,
  });
};

export const getPagePath = ClientFunction(() => window.location.pathname);
export const getPageUrl = ClientFunction(() => window.location.href);


