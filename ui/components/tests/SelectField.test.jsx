import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { context } from 'uniforms';
import createContext from '../../../tests/helpers/uniforms/_createContext';
import '../../../tests/helpers/unit';

const AutoFormProvider = context.Provider;

import SelectField from '../SelectField';

test('displays select field', async () => {
  const { context } = createContext({ x: { type: String, allowedValues: ['a', 'b'] } });

  render(
    <AutoFormProvider value={context}>
      <SelectField id="test-field" name="x" />
    </AutoFormProvider>,
  );
  expect(document.querySelectorAll('#test-field')).toHaveLength(1);
});

// @todo test more stuff
