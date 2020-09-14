import { getByTestId } from "@testing-library/testcafe";
import { Selector } from 'testcafe';
import { loginAsUser, loginAsAdmin, getPagePath, serverUrl } from '../../../../../tests/helpers/e2e';
import { getMockItem } from '../../../../../tests/fixtures/usersRoles'

fixture('UserRoles').page(`${serverUrl}/`);

//authenthicated user required
test('redirect to login when not authenthicated', async (t) => {
  await t.navigateTo('/admin/users/roles');
  await t.expect(getPagePath()).eql('/login');
});


test('should only allow admins to view', async (t) => {
  await loginAsUser(t);

  await t.navigateTo('/admin/users/roles');
  
  await t.expect(getPagePath()).eql('/');
});

test('should load index page', async (t) => {
  await loginAsAdmin(t);
  
  await t.navigateTo('/admin/users/roles');
  
  await t.expect(getPagePath()).eql('/admin/users/roles');
});

const mockUsersRole = getMockItem();

test('should navigate to new item form', async (t) => {
  await loginAsAdmin(t);
  await t.navigateTo('/admin/users/roles');
  await t.expect(getPagePath()).eql('/admin/users/roles'); 
  await t.click(getByTestId('new-users-role-button'));
  await t.expect(getPagePath()).eql('/admin/users/roles/new');
});


test('should create new UserRole', async (t) => {
  await loginAsAdmin(t);
  await t.navigateTo('/admin/users/roles/new');
  await t.expect(getPagePath()).eql('/admin/users/roles/new');
 
  const form = Selector('#form-users-role')

  await t.typeText(form.find('input[name=name]'), mockUsersRole.name)
  .click(form.find('button[type=submit]'));
  await t.expect(getPagePath()).eql('/admin/users/roles');
});

// test('should allow users to create an new account', async (t) => {
  
//   await logout(t); //ensure we are not logged in
//   await t.navigateTo('/signup');
//   await t.expect(getPagePath()).contains('/signup');

//   const data = getMockItem();
//   const form = Selector('#form-signup')

//   await t.typeText(form.find('input[name=firstName]'), data.profile.firstName)
//   .typeText(form.find('input[name=lastName]'), data.profile.lastName)
//   .typeText(form.find('input[name=emailAddress]'), data.emails[0].address)
//   .typeText(form.find('input[name=password]'), data.password)
//   .click(form.find('button[type=submit]'));

//   await Selector('[data-testid="user-nav-dropdown"]')();
//   await t.expect(getPagePath()).eql('http://localhost:3000/');
// });
