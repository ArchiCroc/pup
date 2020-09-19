import { getByTestId, getByText, queryByText } from '@testing-library/testcafe';
import { Selector } from 'testcafe';
import {
  adminRole,
  userRole,
  anonymousRole,
  getPagePath,
  serverUrl,
} from '../../../../../tests/helpers/e2e';
import { getMockItem } from '../../../../../tests/fixtures/usersRoles';

const newMockUsersRole = getMockItem(1);
const editMockUsersRole = getMockItem(2);

fixture('UserRoles').page(`${serverUrl}/`);

test('redirect anonymous user to login', async (t) => {
  await t.useRole(anonymousRole).navigateTo('/admin/users/roles');

  await t.expect(getPagePath()).eql('/login');
});

test('should only allow admins to view', async (t) => {
  await t.useRole(userRole).navigateTo('/admin/users/roles');

  await t.expect(getPagePath()).eql('/');
});

test('should load index page', async (t) => {
  await t.useRole(adminRole).navigateTo('/admin/users/roles');

  await t.expect(getPagePath()).eql('/admin/users/roles');
});

test('should navigate to new item form', async (t) => {
  await t.useRole(adminRole).navigateTo('/admin/users/roles');

  await t.expect(getPagePath()).eql('/admin/users/roles');

  await t.click(getByTestId('new-users-role-button'));

  await t.expect(getPagePath()).eql('/admin/users/roles/new');
});

test('should create new UserRole', async (t) => {
  await t.useRole(adminRole).navigateTo('/admin/users/roles/new');
  await t.expect(getPagePath()).eql('/admin/users/roles/new');

  const form = Selector('#form-users-role');

  await t
    .typeText(form.find('input[name=name]'), newMockUsersRole.name)
    .click(form.find('button[type=submit]'));

  // make sure new item is listed
  await t.expect(getPagePath()).eql('/admin/users/roles');
  await t.expect(getByText(newMockUsersRole.name).exists).ok();
});

test('should display UsersRole detail page', async (t) => {
  await t.useRole(adminRole).navigateTo('/admin/users/roles');
  await t.expect(getPagePath()).eql('/admin/users/roles');

  await t.click(getByText(newMockUsersRole.name));

  await t.expect(getPagePath()).match(/\/admin\/users\/roles\/([a-z0-9-_]+)/);
  await t.expect(getByTestId('users-roles-name').textContent).eql(newMockUsersRole.name);
});

test('should navigate to the edit UsersRole form', async (t) => {
  await t.useRole(adminRole).navigateTo('/admin/users/roles');
  await t.expect(getPagePath()).eql('/admin/users/roles');
  await t.click(getByText(newMockUsersRole.name));
  await t.expect(getPagePath()).match(/\/admin\/users\/roles\/([a-z0-9-_]+)/);

  // navigate to the correct item
  await t.click(getByTestId('edit-users-role-button'));
  await t.expect(getPagePath()).match(/\/admin\/users\/roles\/([a-z0-9-_]+)\/edit/);
});

test('should edit UsersRole', async (t) => {
  await t.useRole(adminRole).navigateTo('/admin/users/roles');
  await t.expect(getPagePath()).eql('/admin/users/roles');

  // navigate to the correct item
  await t.click(getByText(newMockUsersRole.name));
  await t.expect(getPagePath()).match(/\/admin\/users\/roles\/([a-z0-9-_]+)/);

  //click the edit button
  await t.click(getByTestId('edit-users-role-button'));
  await t.expect(getPagePath()).match(/\/admin\/users\/roles\/([a-z0-9-_]+)\/edit/);

  const form = Selector('#form-users-role');
  const nameField = form.find('input[name=name]');

  await t
    .expect(nameField.value)
    .eql(newMockUsersRole.name) //make sure orginal vlaue is present
    .click(nameField)
    .pressKey('ctrl+a delete') //clear field
    .typeText(nameField, editMockUsersRole.name); // type new value

  await t.click(form.find('button[type=submit]'));
  await t.expect(getPagePath()).eql('/admin/users/roles');

  //verify edited item is listed on the page
  await t.expect(getPagePath()).eql('/admin/users/roles');
  await t.expect(getByText(editMockUsersRole.name).exists).ok();
});

test('should show detail of edited UserRole', async (t) => {
  await t.useRole(adminRole).navigateTo('/admin/users/roles');
  await t.expect(getPagePath()).eql('/admin/users/roles');

  // navigate to the correct item
  await t.click(getByText(editMockUsersRole.name));
  await t.expect(getPagePath(editMockUsersRole.name)).match(/\/admin\/users\/roles\/([a-z0-9-_]+)/);
  await t.expect(getByTestId('users-roles-name').textContent).eql(editMockUsersRole.name);
});

test('should delete UserRole', async (t) => {
  await t.useRole(adminRole).navigateTo('/admin/users/roles');
  await t.expect(getPagePath()).eql('/admin/users/roles');

  // navigate to the correct item
  await t.click(getByText(editMockUsersRole.name));
  await t.expect(getPagePath(editMockUsersRole.name)).match(/\/admin\/users\/roles\/([a-z0-9-_]+)/);

  //click the edit button
  await t.click(getByTestId('edit-users-role-button'));
  await t.expect(getPagePath()).match(/\/admin\/users\/roles\/([a-z0-9-_]+)\/edit/);

  // click delete
  await t.click(getByTestId('remove-users-role-button'));
  await t.click(getByTestId('remove-users-role-ok-button'));

  // navigate to index page and make sure it is gone
  await t.expect(getPagePath()).eql('/admin/users/roles');
  await t.expect(queryByText(editMockUsersRole.name)).notOk();
});
