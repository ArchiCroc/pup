import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Alert from '../Alert';

test('loads and displays greeting', async () => {
  const { getByText } = render(<Alert type="info">Hello, world!</Alert>);
  expect(getByText('Hello, world!')).toBeInTheDocument();
});
