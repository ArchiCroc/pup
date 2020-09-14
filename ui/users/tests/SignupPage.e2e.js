import { Selector } from 'testcafe';
import { logout, getPagePath, serverUrl } from '../../../tests/helpers/e2e';
import { getMockItem } from '../../../tests/fixtures/users'

fixture `Users/Signup`
  .page `${serverUrl}/`;

test('should allow users to create an new account', async (t) => {
  
  await logout(t); //ensure we are not logged in
  await t.navigateTo('/signup');
  await t.expect(getPagePath()).contains('/signup');

  const data = getMockItem();
  const form = Selector('#form-signup')

  await t.typeText(form.find('input[name=firstName]'), data.profile.firstName)
  .typeText(form.find('input[name=lastName]'), data.profile.lastName)
  .typeText(form.find('input[name=emailAddress]'), data.email)
  .typeText(form.find('input[name=password]'), data.password)
  .click(form.find('button[type=submit]'));

  await Selector('[data-testid="user-nav-dropdown"]')();
  await t.expect(getPagePath()).eql('/');
});
