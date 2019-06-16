import unfreezeApolloCacheValue from './unfreezeApolloCacheValue';
import { documents } from '../tests/fixtures/documents';

describe('unfreezeApolloCacheValue.js', () => {
  test('it unfreezes a frozen JavaScript Object', () => {
    const frozenObject = Object.freeze({
      ...documents[0],
      __typename: 'Document',
    });

    const unfrozenCacheValue = unfreezeApolloCacheValue(frozenObject);

    expect(unfrozenCacheValue).toEqual({
      _id: 'document123',
      isPublic: true,
      userId: 'abc123',
      title: 'Document Title #1',
      body: 'This is my document. There are many like it, but this one is mine.',
      createdAt: '2018-11-05T20:34:54.225Z',
      updatedAt: '2018-11-05T20:34:54.225Z',
    });
  });

  test('it removes __typename field from objects', () => {
    const frozenObject = Object.freeze({
      ...documents[0],
      __typename: 'Document',
    });

    const unfrozenCacheValue = unfreezeApolloCacheValue(frozenObject);

    expect(unfrozenCacheValue.__typename).toBe(undefined); //eslint-disable-line
  });

  test('it removes __typename field from objects in array', () => {
    const frozenArray = Object.freeze(
      documents.map((doc) => {
        return {
          ...doc,
          __typename: 'Document',
        };
      }),
    );

    const unfrozenCacheValue = unfreezeApolloCacheValue(frozenArray);

    unfrozenCacheValue.forEach((cacheValue) => {
      expect(cacheValue.__typename).toBe(undefined); //eslint-disable-line
    });
  });

  test('it removes __typename field from nested objects in array', () => {
    const frozenArray = Object.freeze(
      documents.map((doc) => {
        return {
          ...doc,
          nested: {
            ...doc,
            __typename: 'Document',
          },
          __typename: 'Document',
        };
      }),
    );

    const unfrozenCacheValue = unfreezeApolloCacheValue(frozenArray);

    unfrozenCacheValue.forEach((cacheValue) => {
      expect(cacheValue.__typename).toBe(undefined); //eslint-disable-line
      expect(cacheValue.nested.__typename).toBe(undefined); //eslint-disable-line
    });
  });
});
