import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import routeData from 'react-router';

import AuthenticatedNavigation from '../AuthenticatedNavigation';

const mockLocation = {
  pathname: '/',
  hash: '',
  search: '',
  state: '',
};
beforeEach(() => {
  jest.spyOn(routeData, 'useLocation').mockReturnValue(mockLocation);
});

test('Shows logged in Users FullName', async () => {
  const { getByText } = render(<AuthenticatedNavigation roles={['user']} name="Test Name" />);
  expect(getByText('Test Name')).toBeInTheDocument();
});
test('User Role should not see admin submenu', async () => {
  const { queryByTestId } = render(<AuthenticatedNavigation roles={['user']} name="Test Name" />);
  expect(queryByTestId('nav-submenu-admin')).toEqual(null);
});
test('Shows admin sub menu when user has role admin', async () => {
  const { queryByTestId } = render(
    <AuthenticatedNavigation roles={['user', 'admin']} name="Test Name" />,
  );
  expect(queryByTestId('nav-submenu-admin')).not.toEqual(null);
});
