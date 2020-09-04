import React from 'react';
import { render, act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import { context } from 'uniforms';
import { MockedProvider } from '@apollo/client/testing';
import * as Apollo from '@apollo/client'; //TempFix https://github.com/apollographql/apollo-client/issues/6803
import createContext from '../../../tests/helpers/uniforms/_createContext';
import '../../../tests/helpers/unit';

const AutoFormProvider = context.Provider;

import {
  createCrossReferenceSearchFieldQueries,
  default as CrossReferenceSearchField,
} from '../CrossReferenceSearchField';

// based on https://www.apollographql.com/docs/react/development-testing/testing/

const uniforms = {
  query: 'users',
  edges: 'users',
  initialLabelKey: 'user',
  labelKey: 'fullName',
  valueKey: '_id',
  idType: 'String',
};

test('displays cross referrence select field', async () => {
  const { context } = createContext({ x: { type: String, uniforms } });

  const queries = createCrossReferenceSearchFieldQueries(uniforms);

  const mocks = [
    {
      request: {
        query: queries.search,
        variables: {
          search: null,
        },
      },
      result: {
        data: {
          users: {
            total: 0,
            users: [],
          },
        },
      },
    },
  ];

  const { queryAllByLabelText } = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <AutoFormProvider value={context}>
        <CrossReferenceSearchField id="test-field" name="x" />
      </AutoFormProvider>
    </MockedProvider>,
  );
  expect(document.querySelectorAll('#test-field')).toHaveLength(1);
});

test('displays loading', async () => {
  const { context } = createContext({ x: { type: String, uniforms } });

  const queries = createCrossReferenceSearchFieldQueries(uniforms);

  const mocks = [
    {
      request: {
        query: queries.search,
        variables: {
          search: 'U',
        },
      },
      result: new Promise((resolve) => setTimeout(resolve, 1000)), // this forces loading screen, this doesn't
    },
  ];

  render(
    <MockedProvider mocks={mocks}>
      <AutoFormProvider value={context}>
        <CrossReferenceSearchField id="test-field" name="x" initialSearch="U" />
      </AutoFormProvider>
    </MockedProvider>,
  );

  expect(screen.queryAllByLabelText('loading')).toHaveLength(1);
});

test('displays final results of cross referrence select field', async () => {
  const { context } = createContext({ x: { type: String, uniforms } });

  const queries = createCrossReferenceSearchFieldQueries(uniforms);

  const mocks = [
    {
      request: {
        query: queries.search,
        variables: {
          search: 'U',
        },
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

  // temp fix while Mock provider is broken
  // https://github.com/apollographql/apollo-client/issues/6803
  jest.spyOn(Apollo, 'useQuery').mockImplementation(() => {
    return {
      loading: false,
      error: undefined,
      data: mocks[0].result.data,
      refetch: jest.fn(),
    };
  });

  await act(async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AutoFormProvider value={context}>
          <CrossReferenceSearchField id="test-field" name="x" initialSearch="U" />
        </AutoFormProvider>
      </MockedProvider>,
    );
    //userEvent.click(screen.getByRole('combobox'));
    //userEvent.type(screen.getByRole('combobox'), 'U');
    await new Promise((resolve) => setTimeout(resolve, 0)); // wait for response
  });
  expect(screen.queryAllByLabelText('loading')).toHaveLength(0);
});
// @todo test that results are displayed
// @todo test initial value(s) lookup
