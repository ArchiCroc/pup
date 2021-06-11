import { Selector } from 'testcafe';
import { anonymousRole, getPagePath, serverUrl } from '../../../../tests/helpers/e2e';
import { getMockItem } from '../../../api/Users/fixtures';

fixture`Users/Signup`.page`${serverUrl}/`;

test('should allow users to create an new account', async (t) => {
  await t.useRole(anonymousRole).navigateTo('/signup').expect(getPagePath()).contains('/signup');

  const data = getMockItem();
  const form = Selector('#form-signup');

  // console.log('Users/Signup', data);

  await t
    .typeText(form.find('input[name=firstName]'), data.profile.firstName)
    .typeText(form.find('input[name=lastName]'), data.profile.lastName)
    .typeText(form.find('input[name=emailAddress]'), data.email)
    .typeText(form.find('input[name=password]'), data.password)
    .click(form.find('button[type=submit]'));

  await Selector('[data-testid="user-nav-dropdown"]')();
  await t.expect(getPagePath()).eql('/');
});
