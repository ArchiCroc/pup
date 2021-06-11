import { getByTestId, getByText, queryByText } from '@testing-library/testcafe';
import { Selector } from 'testcafe';
import { ReactSelector } from 'testcafe-react-selectors';
import { getMockItem } from '../../../../../api/Users/Roles/fixtures';
import {
  adminRole,
  anonymousRole,
  getPagePath,
  serverUrl,
  userRole,
} from '../../../../../../tests/helpers/e2e';

const mockNewUsersRole = getMockItem(1);
const mockEditUsersRole = getMockItem(2);
const usersRolesBasePath = '/admin/users/roles';

fixture('UsersRoles').page(`${serverUrl}/`);

test('redirect anonymous user to login', async (t) => {
  await t.useRole(anonymousRole).navigateTo(usersRolesBasePath);

  await t.expect(getPagePath()).eql('/login');
});

test('should only allow admins to view', async (t) => {
  await t.useRole(userRole).navigateTo(usersRolesBasePath);

  await t.expect(getPagePath()).eql('/');
});

test('should load UsersRoles index page', async (t) => {
  await t.useRole(adminRole).navigateTo(usersRolesBasePath);

  await t.expect(getPagePath()).eql(usersRolesBasePath);
});

test('make sure we have a clean slate', async (t) => {
  await t.useRole(adminRole).navigateTo(usersRolesBasePath);
  await t.expect(getPagePath()).eql(usersRolesBasePath);

  const items = [
    Selector(queryByText(mockNewUsersRole.name)),
    Selector(queryByText(mockEditUsersRole.name)),
  ];
  items.forEach(async (item) => {
    if (await item.exists) {
      await t.click(item);
      // navigate to the correct item
      await t.click(getByText(mockEditUsersRole.name));
      await t.expect(getPagePath()).match(new RegExp(`${usersRolesBasePath}/([a-z0-9-_]+)`));

      //click the edit button
      await t.click(ReactSelector('EditUsersRoleButton'));
      await t.expect(getPagePath()).match(new RegExp(`${usersRolesBasePath}/([a-z0-9-_]+)/edit`));

      // click delete
      await t.click(ReactSelector('RemoveUsersRoleButton'));
      await t.click(getByTestId('remove-users-role-ok-button'));
    }
  });
});

test('should navigate to NewUsersRolePage', async (t) => {
  await t.useRole(adminRole).navigateTo(usersRolesBasePath);

  await t.expect(getPagePath()).eql(usersRolesBasePath);

  await t.click(ReactSelector('NewUsersRoleButton'));

  await t.expect(getPagePath()).eql(`${usersRolesBasePath}/new`);
});

test('should create new UsersRole', async (t) => {
  await t.useRole(adminRole).navigateTo(`${usersRolesBasePath}/new`);
  await t.expect(getPagePath()).eql(`${usersRolesBasePath}/new`);

  const form = ReactSelector('AutoForm').withProps({ name: 'usersRole' });

  // @todo change Hidden _id field
  // set Text name field
  const nameField = form.findReact('Text').withProps({ name: 'name' });
  await t.typeText(nameField, mockNewUsersRole.name);
  await t.click(form.find('button[type=submit]'));

  // make sure new item is listed
  await t.expect(getPagePath()).eql(usersRolesBasePath);
  await t.expect(getByText(mockNewUsersRole.name).exists).ok();
});

test('should display ViewUsersRolePage', async (t) => {
  await t.useRole(adminRole).navigateTo(usersRolesBasePath);
  await t.expect(getPagePath()).eql(usersRolesBasePath);

  await t.click(getByText(mockNewUsersRole.name));

  await t.expect(getPagePath()).match(new RegExp(`${usersRolesBasePath}/([a-z0-9-_]+)`));

  const page = ReactSelector('ViewUsersRoleFields');
  //viewFieldTests mockNewUsersRole
  // validate Text name field //textContent
  await t
    .expect(
      page.findReact('ValueWrapper').withProps({ name: 'name' }).withText(mockNewUsersRole.name)
        .exists,
    )
    .ok();
});

test('should navigate to the EditUsersRolePage', async (t) => {
  await t.useRole(adminRole).navigateTo(usersRolesBasePath);
  await t.expect(getPagePath()).eql(usersRolesBasePath);
  await t.click(getByText(mockNewUsersRole.name));
  await t.expect(getPagePath()).match(new RegExp(`${usersRolesBasePath}/([a-z0-9-_]+)`));

  // navigate to the correct item
  await t.click(ReactSelector('EditUsersRoleButton'));
  await t.expect(getPagePath()).match(new RegExp(`${usersRolesBasePath}/([a-z0-9-_]+)/edit`));
});

test('should edit UsersRole', async (t) => {
  await t.useRole(adminRole).navigateTo(usersRolesBasePath);
  await t.expect(getPagePath()).eql(usersRolesBasePath);

  // navigate to the correct item
  await t.click(getByText(mockNewUsersRole.name));
  await t.expect(getPagePath()).match(new RegExp(`${usersRolesBasePath}/([a-z0-9-_]+)`));

  //click the edit button
  await t.click(ReactSelector('EditUsersRoleButton'));
  await t.expect(getPagePath()).match(new RegExp(`${usersRolesBasePath}/([a-z0-9-_]+)/edit`));

  const form = ReactSelector('AutoForm').withProps({ name: 'usersRole' });

  // @todo change  Hidden _id field
  // change Text name field
  const nameField = form.findReact('Text').withProps({ name: 'name' });
  await t
    .expect(nameField.find('input').value)
    .eql(mockNewUsersRole.name) //make sure orginal value is present
    .click(nameField)
    .pressKey('ctrl+a delete') //clear field
    .typeText(nameField, mockEditUsersRole.name); // type new value
  await t.click(form.find('button[type=submit]'));

  await t.expect(getPagePath()).eql(usersRolesBasePath);

  //verify edited item is listed on the page
  await t.expect(getPagePath()).eql(usersRolesBasePath);
  await t.expect(getByText(mockEditUsersRole.name).exists).ok();
});

test('should show ViewPage of edited UsersRole', async (t) => {
  await t.useRole(adminRole).navigateTo(usersRolesBasePath);
  await t.expect(getPagePath()).eql(usersRolesBasePath);

  // navigate to the correct item
  await t.click(getByText(mockEditUsersRole.name));
  await t
    .expect(getPagePath(mockEditUsersRole.name))
    .match(new RegExp(`${usersRolesBasePath}/([a-z0-9-_]+)`));

  const page = ReactSelector('ViewUsersRoleFields');
  //viewFieldTests mockEditUsersRole
  // validate Text name field //textContent
  await t
    .expect(
      page.findReact('ValueWrapper').withProps({ name: 'name' }).withText(mockEditUsersRole.name)
        .exists,
    )
    .ok();
});

test('should delete UsersRole', async (t) => {
  await t.useRole(adminRole).navigateTo(usersRolesBasePath);
  await t.expect(getPagePath()).eql(usersRolesBasePath);

  // navigate to the correct item
  await t.click(getByText(mockEditUsersRole.name));
  await t.expect(getPagePath()).match(new RegExp(`${usersRolesBasePath}/([a-z0-9-_]+)`));

  //click the edit button
  await t.click(ReactSelector('EditUsersRoleButton'));
  await t.expect(getPagePath()).match(new RegExp(`${usersRolesBasePath}/([a-z0-9-_]+)/edit`));

  // click delete
  await t.click(ReactSelector('RemoveUsersRoleButton'));
  await t.click(getByTestId('remove-users-role-ok-button'));

  // navigate to index page and make sure it is gone
  await t.expect(getPagePath()).eql(usersRolesBasePath);
  await t.expect(queryByText(mockEditUsersRole.name).exists).notOk();
});
