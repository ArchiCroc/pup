import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { MockedProvider } from '@apollo/client/testing';

import '@testing-library/jest-dom/extend-expect';
import '../../../tests/helpers/unit';

import NewErrorReportPage from '../NewErrorReportPage';

test('loads page', async () => {
  const { queryAllByRole } = render(
    // <MockedProvider mocks={[]}>
    //   <MemoryRouter>
    <NewErrorReportPage />,
    //   </MemoryRouter>
    // </MockedProvider>,
  );
  expect(queryAllByRole('heading')).toHaveLength(1);
});
