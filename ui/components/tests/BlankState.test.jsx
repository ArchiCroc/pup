import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import BlankState from '../BlankState';

test('loads and displays greeting', async () => {
  const { getByText } = render(<BlankState title="TESTX" subtitle="TESTY" />);
  expect(getByText('TESTX')).toBeInTheDocument();
  expect(getByText('TESTY')).toBeInTheDocument();
});

// @todo test the button
