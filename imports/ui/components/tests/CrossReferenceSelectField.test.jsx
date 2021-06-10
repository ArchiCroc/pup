import React from 'react';
import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { context } from 'uniforms';
import { MockedProvider } from '@apollo/client/testing';
import createContext from '/tests/helpers/uniforms/_createContext';
import '/tests/helpers/unit';

const AutoFormProvider = context.Provider;

import {
  createCrossReferenceSelectFieldQuery,
  default as CrossReferenceSelectField,
} from '../CrossReferenceSelectField';

// based on https://www.apollographql.com/docs/react/development-testing/testing/

const uniforms = {
  query: 'users',
  edges: 'users',
  initialLabelKey: 'user',
  labelKey: 'fullName',
  valueKey: '_id',
  //idType: 'String', // not used here
};

test('displays cross referrence select field', async () => {
  const { context } = createContext({ x: { type: String, uniforms } });

  const query = createCrossReferenceSelectFieldQuery(uniforms);

  const mocks = [
    {
      request: {
        query,
      },
      result: {
        data: {
          users: {
            total: 3,
            users: [
              { _id: '000001', fullname: 'User 1' },
              { _id: '000002', fullname: 'User 2' },
              { _id: '000003', fullname: 'User 3' },
            ],
          },
        },
      },
    },
  ];

  const { queryAllByLabelText } = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <AutoFormProvider value={context}>
        <CrossReferenceSelectField id="test-field" name="x" />
      </AutoFormProvider>
    </MockedProvider>,
  );
  expect(document.querySelectorAll('#test-field')).toHaveLength(1);
});

test('displays loading', async () => {
  const { context } = createContext({ x: { type: String, uniforms } });

  const query = createCrossReferenceSelectFieldQuery(uniforms);

  const mocks = [
    {
      request: {
        query,
      },
      result: new Promise((resolve) => setTimeout(resolve, 5)), // this forces loading screen, this doesn't quite match what the docs say
    },
  ];

  const { queryAllByLabelText } = render(
    <MockedProvider mocks={mocks}>
      <AutoFormProvider value={context}>
        <CrossReferenceSelectField id="test-field" name="x" />
      </AutoFormProvider>
    </MockedProvider>,
  );
  expect(queryAllByLabelText('loading')).toHaveLength(1);
});

test('displays final results of cross referrence select field', async () => {
  const { context } = createContext({ x: { type: String, uniforms } });

  const query = createCrossReferenceSelectFieldQuery(uniforms);

  const mocks = [
    {
      request: {
        query,
      },
      result: {
        data: {
          users: {
            total: 3,
            users: [
              { _id: '000001', fullname: 'User 1' },
              { _id: '000002', fullname: 'User 2' },
              { _id: '000003', fullname: 'User 3' },
            ],
          },
        },
      },
    },
  ];

  const { queryAllByLabelText } = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <AutoFormProvider value={context}>
        <CrossReferenceSelectField id="test-field" name="x" />
      </AutoFormProvider>
    </MockedProvider>,
  );

  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0)); // wait for response
  });

  expect(queryAllByLabelText('loading')).toHaveLength(0);
});

// @todo test more stuff
