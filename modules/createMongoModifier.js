import difference from 'lodash/difference';

function createMongoModifier(schema, object) {
  const keys = Object.keys(schema.schema());

  const unsetKeys = difference(keys, Object.keys(object));
  const $unset = {};

  for (let i = 0; i < unsetKeys.length; i++) {
    const key = unsetKeys[i];
    // @todo this needs more testing
    if (!key.includes('$')) {
      $unset[key] = 1;
    }
  }

  const modifiers = {};
  if (Object.keys(object).length > 0) {
    modifiers.$set = object;
  }
  if (Object.keys($unset).length > 0) {
    modifiers.$unset = $unset;
  }
  return modifiers;
}

export default createMongoModifier;
