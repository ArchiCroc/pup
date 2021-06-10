import { getByTestId, getByText, queryByText } from '@testing-library/testcafe';
import { Selector } from 'testcafe';
import { ReactSelector } from 'testcafe-react-selectors';
import { getMockItem } from '/imports/api/ErrorReports/fixtures';
import { adminRole, anonymousRole, getPagePath, serverUrl, userRole } from '/tests/helpers/e2e';

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

test('make sure we have a clean slate', async (t) => {
  await t.useRole(adminRole).navigateTo(errorReportsBasePath);
  await t.expect(getPagePath()).eql(errorReportsBasePath);

  const items = [
    Selector(queryByText(mockNewErrorReport.message)),
    Selector(queryByText(mockEditErrorReport.message)),
  ];
  items.forEach(async (item) => {
    if (await item.exists) {
      await t.click(item);
      // navigate to the correct item
      await t.click(getByText(mockEditErrorReport.message));
      await t.expect(getPagePath()).match(new RegExp(`${errorReportsBasePath}/([a-z0-9-_]+)`));

      //click the edit button
      await t.click(ReactSelector('EditErrorReportButton'));
      await t.expect(getPagePath()).match(new RegExp(`${errorReportsBasePath}/([a-z0-9-_]+)/edit`));

      // click delete
      await t.click(ReactSelector('RemoveErrorReportButton'));
      await t.click(getByTestId('remove-error-report-ok-button'));
    }
  });
});

test('should navigate to NewErrorReportPage', async (t) => {
  await t.useRole(adminRole).navigateTo(errorReportsBasePath);

  await t.expect(getPagePath()).eql(errorReportsBasePath);

  await t.click(ReactSelector('NewErrorReportButton'));

  await t.expect(getPagePath()).eql(`${errorReportsBasePath}/new`);
});

test('should create new ErrorReport', async (t) => {
  await t.useRole(adminRole).navigateTo(`${errorReportsBasePath}/new`);
  await t.expect(getPagePath()).eql(`${errorReportsBasePath}/new`);

  const form = ReactSelector('AutoForm').withProps({ name: 'errorReport' });

  // @todo change Hidden _id field
  // set CrossReferenceSearch userId field
  const userIdField = form.findReact('CrossReferenceSearchField').withProps({ name: 'userId' });
  await t
    .click(userIdField)
    .typeText(userIdField.find('input'), mockNewErrorReport.user.label)
    .expect(userIdField.findReact('List').exists)
    .ok()
    .click(userIdField.findReact('Item').withText(mockNewErrorReport.user.label));
  // set Select level field
  const levelField = form.findReact('Select').withProps({ name: 'level' });
  await t
    .click(levelField)
    .expect(levelField.findReact('List').exists)
    .ok()
    .click(levelField.findReact('Item').withKey(mockNewErrorReport.level));
  // set Text message field
  const messageField = form.findReact('Text').withProps({ name: 'message' });
  await t.typeText(messageField, mockNewErrorReport.message);
  // set Text path field
  const pathField = form.findReact('Text').withProps({ name: 'path' });
  await t.typeText(pathField, mockNewErrorReport.path);
  // set Text userAgent field
  const userAgentField = form.findReact('Text').withProps({ name: 'userAgent' });
  await t.typeText(userAgentField, mockNewErrorReport.userAgent);
  // set List stack field
  const stackListField = form.findReact('ListField').withProps({ name: 'stack' });
  const stackFieldList = await stackListField
    .findReact('List')
    .getReact(({ props }) => props.value);
  const stackFieldItemCount = Array.isArray(stackFieldList) ? stackFieldList.length : 0;
  const stackMockLength = mockNewErrorReport.stack.length;
  //loop over mock values
  for (let i = 0; i < stackMockLength; i++) {
    if (i >= stackFieldItemCount) {
      // click add button
      await t.click(stackListField.findReact('ListAddField'));
    }
    // set Text stack field
    const stackField = form.findReact('Text').withProps({ name: `stack.${i}` });
    await t.typeText(stackField, mockNewErrorReport.stack[i]);
  }
  // set List reactStack field
  const reactStackListField = form.findReact('ListField').withProps({ name: 'reactStack' });
  const reactStackFieldList = await reactStackListField
    .findReact('List')
    .getReact(({ props }) => props.value);
  const reactStackFieldItemCount = Array.isArray(reactStackFieldList)
    ? reactStackFieldList.length
    : 0;
  const reactStackMockLength = mockNewErrorReport.reactStack.length;
  //loop over mock values
  for (let i = 0; i < reactStackMockLength; i++) {
    if (i >= reactStackFieldItemCount) {
      // click add button
      await t.click(reactStackListField.findReact('ListAddField'));
    }
    // set Text reactStack field
    const reactStackField = form.findReact('Text').withProps({ name: `reactStack.${i}` });
    await t.typeText(reactStackField, mockNewErrorReport.reactStack[i]);
  }
  await t.click(form.find('button[type=submit]'));

  // make sure new item is listed
  await t.expect(getPagePath()).eql(errorReportsBasePath);
  await t.expect(getByText(mockNewErrorReport.message).exists).ok();
});

test('should display ViewErrorReportPage', async (t) => {
  await t.useRole(adminRole).navigateTo(errorReportsBasePath);
  await t.expect(getPagePath()).eql(errorReportsBasePath);

  await t.click(getByText(mockNewErrorReport.message));

  await t.expect(getPagePath()).match(new RegExp(`${errorReportsBasePath}/([a-z0-9-_]+)`));

  const page = ReactSelector('ViewErrorReportFields');
  //viewFieldTests mockNewErrorReport
  // validate CrossReferenceSearch user field
  await t
    .expect(
      page
        .findReact('ValueWrapper')
        .withProps({ name: 'user', value: mockNewErrorReport.user.label }).exists,
    )
    .ok();
  // validate Select level field
  await t
    .expect(
      page.findReact('ValueWrapper').withProps({ name: 'level', value: mockNewErrorReport.level })
        .exists,
    )
    .ok();
  // validate Text message field //textContent
  await t
    .expect(
      page
        .findReact('ValueWrapper')
        .withProps({ name: 'message' })
        .withText(mockNewErrorReport.message).exists,
    )
    .ok();
  // validate Text path field //textContent
  await t
    .expect(
      page.findReact('ValueWrapper').withProps({ name: 'path' }).withText(mockNewErrorReport.path)
        .exists,
    )
    .ok();
  // validate Text userAgent field //textContent
  await t
    .expect(
      page
        .findReact('ValueWrapper')
        .withProps({ name: 'userAgent' })
        .withText(mockNewErrorReport.userAgent).exists,
    )
    .ok();
  // validate Text stack field //textContent
  await t
    .expect(
      page
        .findReact('ValueWrapper')
        .withProps({ name: 'stack' })
        .withText(mockNewErrorReport.stack[0]).exists,
    )
    .ok();
  // validate Text reactStack field //textContent
  await t
    .expect(
      page
        .findReact('ValueWrapper')
        .withProps({ name: 'reactStack' })
        .withText(mockNewErrorReport.reactStack[0]).exists,
    )
    .ok();
});

test('should navigate to the EditErrorReportPage', async (t) => {
  await t.useRole(adminRole).navigateTo(errorReportsBasePath);
  await t.expect(getPagePath()).eql(errorReportsBasePath);
  await t.click(getByText(mockNewErrorReport.message));
  await t.expect(getPagePath()).match(new RegExp(`${errorReportsBasePath}/([a-z0-9-_]+)`));

  // navigate to the correct item
  await t.click(ReactSelector('EditErrorReportButton'));
  await t.expect(getPagePath()).match(new RegExp(`${errorReportsBasePath}/([a-z0-9-_]+)/edit`));
});

test('should edit ErrorReport', async (t) => {
  await t.useRole(adminRole).navigateTo(errorReportsBasePath);
  await t.expect(getPagePath()).eql(errorReportsBasePath);

  // navigate to the correct item
  await t.click(getByText(mockNewErrorReport.message));
  await t.expect(getPagePath()).match(new RegExp(`${errorReportsBasePath}/([a-z0-9-_]+)`));

  //click the edit button
  await t.click(ReactSelector('EditErrorReportButton'));
  await t.expect(getPagePath()).match(new RegExp(`${errorReportsBasePath}/([a-z0-9-_]+)/edit`));

  const form = ReactSelector('AutoForm').withProps({ name: 'errorReport' });

  // @todo change  Hidden _id field
  // @todo change  CrossReferenceSearch userId field
  // @todo change  Select level field
  const levelField = form.findReact('Select').withProps({ name: 'level' });
  await t
    .expect(levelField.getReact(({ props }) => props.value))
    .eql(mockNewErrorReport.level)
    .click(levelField)
    .expect(levelField.findReact('List').exists)
    .ok()
    .click(levelField.findReact('Item').withKey(mockEditErrorReport.level));
  // change Text message field
  const messageField = form.findReact('Text').withProps({ name: 'message' });
  await t
    .expect(messageField.find('input').value)
    .eql(mockNewErrorReport.message) //make sure orginal value is present
    .click(messageField)
    .pressKey('ctrl+a delete') //clear field
    .typeText(messageField, mockEditErrorReport.message); // type new value
  // change Text path field
  const pathField = form.findReact('Text').withProps({ name: 'path' });
  await t
    .expect(pathField.find('input').value)
    .eql(mockNewErrorReport.path) //make sure orginal value is present
    .click(pathField)
    .pressKey('ctrl+a delete') //clear field
    .typeText(pathField, mockEditErrorReport.path); // type new value
  // change Text userAgent field
  const userAgentField = form.findReact('Text').withProps({ name: 'userAgent' });
  await t
    .expect(userAgentField.find('input').value)
    .eql(mockNewErrorReport.userAgent) //make sure orginal value is present
    .click(userAgentField)
    .pressKey('ctrl+a delete') //clear field
    .typeText(userAgentField, mockEditErrorReport.userAgent); // type new value
  // change  List stack field
  const stackListField = form.findReact('ListField').withProps({ name: 'stack' });
  //get current listItemCount
  const stackFieldList = await stackListField
    .findReact('List')
    .getReact(({ props }) => props.value);
  const stackFieldItemCount = Array.isArray(stackFieldList) ? stackFieldList.length : 0;
  const stackMockLength = mockEditErrorReport.stack.length;

  //loop over mock values
  for (let i = 0; i < stackMockLength; i++) {
    if (i >= stackFieldItemCount) {
      // click add button
      await t.click(stackListField.findReact('ListAddField'));
    }
    // change Text stack field
    const stackField = form.findReact('Text').withProps({ name: `stack.${i}` });
    await t
      .expect(stackField.find('input').value)
      .eql(mockNewErrorReport.stack[i]) //make sure orginal value is present
      .click(stackField)
      .pressKey('ctrl+a delete') //clear field
      .typeText(stackField, mockEditErrorReport.stack[i]); // type new value
  }

  if (stackFieldItemCount > stackMockLength) {
    for (let i = stackMockLength; i < stackFieldItemCount; i++) {
      const iField = stackListField
        .findReact('ListDel')
        .withProps({ name: `stack.${stackMockLength}` });
      await t.click(iField);
    }
  }

  const updatedstackFieldList = await stackListField
    .findReact('List')
    .getReact(({ props }) => props.value);
  const updatedstackFieldItemCount = Array.isArray(updatedstackFieldList)
    ? updatedstackFieldList.length
    : 0;
  await t.expect(updatedstackFieldItemCount).eql(stackMockLength);
  // change  List reactStack field
  const reactStackListField = form.findReact('ListField').withProps({ name: 'reactStack' });
  //get current listItemCount
  const reactStackFieldList = await reactStackListField
    .findReact('List')
    .getReact(({ props }) => props.value);
  const reactStackFieldItemCount = Array.isArray(reactStackFieldList)
    ? reactStackFieldList.length
    : 0;
  const reactStackMockLength = mockEditErrorReport.reactStack.length;

  //loop over mock values
  for (let i = 0; i < reactStackMockLength; i++) {
    if (i >= reactStackFieldItemCount) {
      // click add button
      await t.click(reactStackListField.findReact('ListAddField'));
    }
    // change Text reactStack field
    const reactStackField = form.findReact('Text').withProps({ name: `reactStack.${i}` });
    await t
      .expect(reactStackField.find('input').value)
      .eql(mockNewErrorReport.reactStack[i]) //make sure orginal value is present
      .click(reactStackField)
      .pressKey('ctrl+a delete') //clear field
      .typeText(reactStackField, mockEditErrorReport.reactStack[i]); // type new value
  }

  if (reactStackFieldItemCount > reactStackMockLength) {
    for (let i = reactStackMockLength; i < reactStackFieldItemCount; i++) {
      const iField = reactStackListField
        .findReact('ListDel')
        .withProps({ name: `reactStack.${reactStackMockLength}` });
      await t.click(iField);
    }
  }

  const updatedreactStackFieldList = await reactStackListField
    .findReact('List')
    .getReact(({ props }) => props.value);
  const updatedreactStackFieldItemCount = Array.isArray(updatedreactStackFieldList)
    ? updatedreactStackFieldList.length
    : 0;
  await t.expect(updatedreactStackFieldItemCount).eql(reactStackMockLength);
  await t.click(form.find('button[type=submit]'));

  await t.expect(getPagePath()).eql(errorReportsBasePath);

  //verify edited item is listed on the page
  await t.expect(getPagePath()).eql(errorReportsBasePath);
  await t.expect(getByText(mockEditErrorReport.message).exists).ok();
});

test('should show ViewPage of edited ErrorReport', async (t) => {
  await t.useRole(adminRole).navigateTo(errorReportsBasePath);
  await t.expect(getPagePath()).eql(errorReportsBasePath);

  // navigate to the correct item
  await t.click(getByText(mockEditErrorReport.message));
  await t
    .expect(getPagePath(mockEditErrorReport.message))
    .match(new RegExp(`${errorReportsBasePath}/([a-z0-9-_]+)`));

  const page = ReactSelector('ViewErrorReportFields');
  //console.log(mockEditErrorReport.user);
  //viewFieldTests mockEditErrorReport
  // validate CrossReferenceSearch user field
  await t
    .expect(
      page
        .findReact('ValueWrapper')
        .withProps({ name: 'user', value: mockEditErrorReport.user.label }).exists,
    )
    .ok();
  // validate Select level field
  await t
    .expect(
      page.findReact('ValueWrapper').withProps({ name: 'level', value: mockEditErrorReport.level })
        .exists,
    )
    .ok();
  // validate Text message field //textContent
  await t
    .expect(
      page
        .findReact('ValueWrapper')
        .withProps({ name: 'message' })
        .withText(mockEditErrorReport.message).exists,
    )
    .ok();
  // validate Text path field //textContent
  await t
    .expect(
      page.findReact('ValueWrapper').withProps({ name: 'path' }).withText(mockEditErrorReport.path)
        .exists,
    )
    .ok();
  // validate Text userAgent field //textContent
  await t
    .expect(
      page
        .findReact('ValueWrapper')
        .withProps({ name: 'userAgent' })
        .withText(mockEditErrorReport.userAgent).exists,
    )
    .ok();
  // validate Text stack field //textContent
  await t
    .expect(
      page
        .findReact('ValueWrapper')
        .withProps({ name: 'stack' })
        .withText(mockEditErrorReport.stack[0]).exists,
    )
    .ok();
  // validate Text reactStack field //textContent
  await t
    .expect(
      page
        .findReact('ValueWrapper')
        .withProps({ name: 'reactStack' })
        .withText(mockEditErrorReport.reactStack[0]).exists,
    )
    .ok();
});

test('should delete ErrorReport', async (t) => {
  await t.useRole(adminRole).navigateTo(errorReportsBasePath);
  await t.expect(getPagePath()).eql(errorReportsBasePath);

  // navigate to the correct item
  await t.click(getByText(mockEditErrorReport.message));
  await t.expect(getPagePath()).match(new RegExp(`${errorReportsBasePath}/([a-z0-9-_]+)`));

  //click the edit button
  await t.click(ReactSelector('EditErrorReportButton'));
  await t.expect(getPagePath()).match(new RegExp(`${errorReportsBasePath}/([a-z0-9-_]+)/edit`));

  // click delete
  await t.click(ReactSelector('RemoveErrorReportButton'));
  await t.click(getByTestId('remove-error-report-ok-button'));

  // navigate to index page and make sure it is gone
  await t.expect(getPagePath()).eql(errorReportsBasePath);
  await t.expect(queryByText(mockEditErrorReport.message).exists).notOk();
});
