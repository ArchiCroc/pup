import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import SearchInput from '../SearchInput';

test('loads and has placeholder', async () => {
  const { getByRole } = render(<SearchInput onSearch={() => {}} placeholder="Hello World!" />);
  expect(getByRole('search')).toBeInTheDocument();
  const input = document.querySelector('input');
  expect(input.getAttribute('placeholder')).toBe('Hello World!');
});
