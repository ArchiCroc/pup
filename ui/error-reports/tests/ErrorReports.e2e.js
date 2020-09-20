import { getByTestId, getByText, queryByText } from '@testing-library/testcafe';
import { Selector } from 'testcafe';
import { getMockItem } from '../../../../tests/fixtures/errorReports';
import {
  adminRole,
  anonymousRole,
  getPagePath,
  serverUrl,
  userRole,
} from '../../../../tests/helpers/e2e';

const mockNewErrorReport = getMockItem(1);
const mockEditErrorReport = getMockItem(2);
const errorReportsBasePath = '/admin/error-reports';

fixture('ErrorReports').page(`${serverUrl}/`);

test('redirect anonymous user to login', async (t) => {
  await t.useRole(anonymousRole).navigateTo(errorReportsBasePath);

  await t.expect(getPagePath()).eql('/login');
});

test('should only allow admins to view', async (t) => {
  await t.useRole(userRole).navigateTo(errorReportsBasePath);

  await t.expect(getPagePath()).eql('/');
});

test('should load ErrorReports index page', async (t) => {
  await t.useRole(adminRole).navigateTo(errorReportsBasePath);

  await t.expect(getPagePath()).eql(errorReportsBasePath);
});

test('should navigate to new ErrorReport form', async (t) => {
  await t.useRole(adminRole).navigateTo(errorReportsBasePath);

  await t.expect(getPagePath()).eql(errorReportsBasePath);

  await t.click(getByTestId('new-error-report-button'));

  await t.expect(getPagePath()).eql(`${errorReportsBasePath}/new`);
});

test('should create new ErrorReport', async (t) => {
  await t.useRole(adminRole).navigateTo(`${errorReportsBasePath}/new`);
  await t.expect(getPagePath()).eql(`${errorReportsBasePath}/new`);

  const form = Selector('#form-error-report');

  // @todo change Hidden _id field
  // @todo change CrossReferenceSearch userId field
  // @todo change Select level field
  // change Text message field
  await t.typeText(form.find('input[name=message'), mockNewErrorReport.message);
  // change Text path field
  await t.typeText(form.find('input[name=path'), mockNewErrorReport.path);
  // change Text userAgent field
  await t.typeText(form.find('input[name=userAgent'), mockNewErrorReport.userAgent);
  // change Text stack field
  await t.typeText(form.find('input[name=stack'), mockNewErrorReport.stack);
  // change Text reactStack field
  await t.typeText(form.find('input[name=reactStack'), mockNewErrorReport.reactStack);
  await t.click(form.find('button[type=submit]'));

  // make sure new item is listed
  await t.expect(getPagePath()).eql(errorReportsBasePath);
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

  const form = Selector('#form-error-report');

  // @todo change  Hidden _id field
  // @todo change  CrossReferenceSearch userId field
  // @todo change  Select level field
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
  const stackField = form.find('input[name=stack]');
  await t
    .expect(stackField.value)
    .eql(mockNewErrorReport.stack) //make sure orginal vlaue is present
    .click(stackField)
    .pressKey('ctrl+a delete') //clear field
    .typeText(stackField, mockEditErrorReport.stack); // type new value

  // change Text reactStack field
  const reactStackField = form.find('input[name=reactStack]');
  await t
    .expect(reactStackField.value)
    .eql(mockNewErrorReport.reactStack) //make sure orginal vlaue is present
    .click(reactStackField)
    .pressKey('ctrl+a delete') //clear field
    .typeText(reactStackField, mockEditErrorReport.reactStack); // type new value

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
  await t.expect(queryByText(mockEditErrorReport.message)).notOk();
});
