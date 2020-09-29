import { getByTestId, getByText, queryByText, getByRole } from '@testing-library/testcafe';
import { Selector } from 'testcafe';
import { getMockItem } from '../../../tests/fixtures/errorReports';
import {
  adminRole,
  anonymousRole,
  getPagePath,
  serverUrl,
  userRole,
} from '../../../tests/helpers/e2e';
import { ReactSelector } from 'testcafe-react-selectors';

const mockNewErrorReport = getMockItem(1);
const mockEditErrorReport = getMockItem(2);
const errorReportsBasePath = '/admin/error-reports';

console.log(mockNewErrorReport);

fixture('ErrorReports').page(`${serverUrl}/`);

// test('redirect anonymous user to login', async (t) => {
//   await t.useRole(anonymousRole).navigateTo(errorReportsBasePath);

//   await t.expect(getPagePath()).eql('/login');
// });

// test('should only allow admins to view', async (t) => {
//   await t.useRole(userRole).navigateTo(errorReportsBasePath);

//   await t.expect(getPagePath()).eql('/');
// });

// test('should load ErrorReports index page', async (t) => {
//   await t.useRole(adminRole).navigateTo(errorReportsBasePath);

//   await t.expect(getPagePath()).eql(errorReportsBasePath);
// });

// test('should navigate to new ErrorReport form', async (t) => {
//   await t.useRole(adminRole).navigateTo(errorReportsBasePath);

//   await t.expect(getPagePath()).eql(errorReportsBasePath);

//   await t.click(getByTestId('new-error-report-button'));

//   await t.expect(getPagePath()).eql(`${errorReportsBasePath}/new`);
//});

test('should create new ErrorReport', async (t) => {
  await t.useRole(adminRole).navigateTo(`${errorReportsBasePath}/new`);
  await t.expect(getPagePath()).eql(`${errorReportsBasePath}/new`);

  const form = ReactSelector('AutoForm').withProps({ name: 'errorReport' });

  // @todo change Hidden _id field
  // @todo change CrossReferenceSearch userId field
  // const userIdField = form.find('div[name=userId] input');
  const userIdField = form.findReact('CrossReferenceSearchField').withProps({ name: 'userId' });
  await t
    //   //.expect(pathField.value)
    //   //.eql(mockNewErrorReport.path) //make sure orginal vlaue is present
    .click(userIdField)
    .typeText(userIdField.find('input'), mockNewErrorReport.user.label)
    .expect(userIdField.findReact('List').exists)
    .ok()
    .click(userIdField.findReact('Item').withText(mockNewErrorReport.user.label));

  // change Select level field
  const levelField = form.findReact('SelectField').withProps({ name: 'level' });
  await t
    .click(levelField)
    .expect(levelField.findReact('List').exists)
    .ok()
    .click(levelField.findReact('Item').withKey(mockNewErrorReport.level));

  // change Text message field
  const messageField = form.findReact('Text').withProps({ name: 'message' });
  await t.typeText(messageField, mockNewErrorReport.message);
  // change Text path field
  await t.typeText(form.find('input[name=path'), mockNewErrorReport.path);
  // change Text userAgent field
  await t.typeText(form.find('input[name=userAgent'), mockNewErrorReport.userAgent);

  // change Text stack field
  //await t.typeText(form.find('input[name=stack'), mockNewErrorReport.stack);
  // list
  const stackField = form.findReact('ListField').withProps({ name: 'stack' });
  //get current listItemCount
  const stackFieldList = await stackField.findReact('List').getReact(({ props }) => props.value);
  const stackFieldItemCount = Array.isArray(stackFieldList) ? stackFieldList.length : 0;
  const stackFieldMockLength = mockNewErrorReport.stack.length;
  //loop over mock values
  for (let i = 0; i < stackFieldMockLength; i++) {
    //if newMockItems > listItemCount
    console.log(i);
    if (i >= stackFieldItemCount) {
      // click add button
      console.log('click button');
      await t.click(stackField.findReact('ListAddField'));
    }
    const iField = stackField.findReact('Text').withProps({ name: `stack.${i}` });
    await t.typeText(iField, mockNewErrorReport.stack[i]);
  }

  // change Text reactStack field
  //await t.typeText(form.find('input[name=reactStack'), mockNewErrorReport.reactStack);
  await t.debug().click(form.find('button[type=submit]'));

  //make sure there are not any errors
  // ant-form-item-has-error

  await t.expect(form.find('.ant-form-item-has-error').exists).notOk();

  // make sure new item is listed
  await t.expect(getPagePath()).eql(errorReportsBasePath);
  // await t.debug();
  await t.expect(getByText(mockNewErrorReport.message).exists).ok();
});

test('should display ErrorReport detail page', async (t) => {
  await t.useRole(adminRole).navigateTo(errorReportsBasePath);
  await t.expect(getPagePath()).eql(errorReportsBasePath);

  await t.click(getByText(mockNewErrorReport.message));

  await t.expect(getPagePath()).match(new RegExp(`${errorReportsBasePath}/([a-z0-9-_]+)`));
});

test('should navigate to the edit ErrorReport form', async (t) => {
  await t.useRole(adminRole).navigateTo(errorReportsBasePath);
  await t.expect(getPagePath()).eql(errorReportsBasePath);
  await t.click(getByText(mockNewErrorReport.message));
  await t.expect(getPagePath()).match(new RegExp(`${errorReportsBasePath}/([a-z0-9-_]+)`));

  // navigate to the correct item
  await t.click(getByTestId('edit-error-report-button'));
  await t.expect(getPagePath()).match(new RegExp(`${errorReportsBasePath}/([a-z0-9-_]+)/edit`));
});

test('should edit ErrorReport', async (t) => {
  await t.useRole(adminRole).navigateTo(errorReportsBasePath);
  await t.expect(getPagePath()).eql(errorReportsBasePath);

  // navigate to the correct item
  await t.click(getByText(mockNewErrorReport.message));
  await t.expect(getPagePath()).match(new RegExp(`${errorReportsBasePath}/([a-z0-9-_]+)`));

  //click the edit button
  await t.click(getByTestId('edit-error-report-button'));
  await t.expect(getPagePath()).match(new RegExp(`${errorReportsBasePath}/([a-z0-9-_]+)/edit`));

  const form = ReactSelector('AutoForm').withProps({ name: 'errorReport' });

  // @todo change  Hidden _id field
  // @todo change  CrossReferenceSearch userId field
  // change  Select level field
  const levelField = form.findReact('SelectField').withProps({ name: 'level' });
  await t
    .expect(levelField.getReact(({ props }) => props.value))
    .eql(mockNewErrorReport.level)
    .click(levelField)
    .expect(levelField.findReact('List').exists)
    .ok()
    .click(levelField.findReact('Item').withKey(mockEditErrorReport.level));

  // change Text message field
  const messageField = form.find('input[name=message]');
  await t
    .expect(messageField.value)
    .eql(mockNewErrorReport.message) //make sure orginal vlaue is present
    .click(messageField)
    .pressKey('ctrl+a delete') //clear field
    .typeText(messageField, mockEditErrorReport.message); // type new value

  // change Text path field
  const pathField = form.find('input[name=path]');
  await t
    .expect(pathField.value)
    .eql(mockNewErrorReport.path) //make sure orginal vlaue is present
    .click(pathField)
    .pressKey('ctrl+a delete') //clear field
    .typeText(pathField, mockEditErrorReport.path); // type new value

  // change Text userAgent field
  const userAgentField = form.find('input[name=userAgent]');
  await t
    .expect(userAgentField.value)
    .eql(mockNewErrorReport.userAgent) //make sure orginal vlaue is present
    .click(userAgentField)
    .pressKey('ctrl+a delete') //clear field
    .typeText(userAgentField, mockEditErrorReport.userAgent); // type new value

  // change Text stack field
  const stackField = form.findReact('ListField').withProps({ name: 'stack' });
  //get current listItemCount
  const stackFieldList = await stackField.findReact('List').getReact(({ props }) => props.value);
  const stackFieldItemCount = Array.isArray(stackFieldList) ? stackFieldList.length : 0;
  const stackFieldMockLength = mockEditErrorReport.stack.length;

  //loop over mock values
  for (let i = 0; i < stackFieldMockLength; i++) {
    //if newMockItems > listItemCount
    console.log(i);
    if (i >= stackFieldItemCount) {
      // click add button
      console.log('click button');
      await t.click(stackField.findReact('ListAddField'));
    }
    const iField = stackField.findReact('Text').withProps({ name: `stack.${i}` });
    await t
      .expect(iField.find('input').value) // @todo this throws a warning but might be false alarm https://github.com/DevExpress/testcafe/issues/5389
      .eql(mockNewErrorReport.stack[i]) //make sure orginal vlaue is present
      .click(iField)
      .pressKey('ctrl+a delete') //clear field
      .typeText(iField, mockEditErrorReport.stack[i]);
  }

  if (stackFieldItemCount > stackFieldMockLength) {
    for (let i = stackFieldMockLength; i < stackFieldItemCount; i++) {
      const iField = stackField
        .findReact('ListDel')
        .withProps({ name: `stack.${stackFieldMockLength}` });
      await t.click(iField);
    }

    const updatedStackFieldList = await stackField
      .findReact('List')
      .getReact(({ props }) => props.value);
    const updatedStackFieldItemCount = Array.isArray(updatedStackFieldList)
      ? updatedStackFieldList.length
      : 0;
    await t.expect(updatedStackFieldItemCount).eql(stackFieldMockLength);
  }
  // change Text reactStack field
  // const reactStackField = form.find('input[name=reactStack]');
  // await t
  //   .expect(reactStackField.value)
  //   .eql(mockNewErrorReport.reactStack) //make sure orginal vlaue is present
  //   .click(reactStackField)
  //   .pressKey('ctrl+a delete') //clear field
  //   .typeText(reactStackField, mockEditErrorReport.reactStack); // type new value

  await t.click(form.find('button[type=submit]'));

  await t.expect(getPagePath()).eql(errorReportsBasePath);

  //verify edited item is listed on the page
  await t.expect(getPagePath()).eql(errorReportsBasePath);
  await t.expect(getByText(mockEditErrorReport.message).exists).ok();
});

test('should show detail of edited ErrorReport', async (t) => {
  await t.useRole(adminRole).navigateTo(errorReportsBasePath);
  await t.expect(getPagePath()).eql(errorReportsBasePath);

  // navigate to the correct item
  await t.click(getByText(mockEditErrorReport.message));
  await t
    .expect(getPagePath(mockEditErrorReport.message))
    .match(new RegExp(`${errorReportsBasePath}/([a-z0-9-_]+)`));
});

test('should delete ErrorReport', async (t) => {
  await t.useRole(adminRole).navigateTo(errorReportsBasePath);
  await t.expect(getPagePath()).eql(errorReportsBasePath);

  // navigate to the correct item
  await t.click(getByText(mockEditErrorReport.message));
  await t.expect(getPagePath()).match(new RegExp(`${errorReportsBasePath}/([a-z0-9-_]+)`));

  //click the edit button
  await t.click(getByTestId('edit-error-report-button'));
  await t.expect(getPagePath()).match(new RegExp(`${errorReportsBasePath}/([a-z0-9-_]+)/edit`));

  // click delete
  await t.click(getByTestId('remove-error-report-button'));
  await t.click(getByTestId('remove-error-report-ok-button'));

  // navigate to index page and make sure it is gone
  await t.expect(getPagePath()).eql(errorReportsBasePath);
  await t.expect(queryByText(mockEditErrorReport.message).count).notOk();
});
