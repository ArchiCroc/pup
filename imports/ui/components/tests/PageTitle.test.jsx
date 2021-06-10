import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import PageTitle from '../PageTitle';

test('Make Sure Page Title is Set', async () => {
  render(<PageTitle title="Hello World!" />);
  await waitFor(() => expect(document.title).toContain('Hello World!'));
});
