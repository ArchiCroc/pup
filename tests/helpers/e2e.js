import { ClientFunction, Selector } from 'testcafe';

export const login = async ({ email, password, browser }) => {
  await browser.typeText('[name="emailAddress"]', email);
  await browser.typeText('[name="password"]', password);
  await browser.click('button[type=submit]');
  await Selector('[data-test="user-nav-dropdown"]')(); // NOTE: If this exists, users was logged in.
};

export const getPageUrl = ClientFunction(() => window.location.href);
