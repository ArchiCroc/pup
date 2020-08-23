import getUserName from './getUserName';

describe('getUserName.js', () => {
  test('it returns a string when passed an object', () => {
    const name = getUserName({ firstName: 'Andy', lastName: 'Warhol' });
    expect(name).toBe('Andy Warhol');
  });

  test('it returns a string when passed a string', () => {
    const name = getUserName('Andy Warhol');
    expect(name).toBe('Andy Warhol');
  });
});
