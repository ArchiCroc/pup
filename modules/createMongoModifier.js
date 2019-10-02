import difference from 'lodash/difference';

function createMongoModifier(schema, object) {
  const keys = Object.keys(schema.schema());

  const unsetKeys = difference(keys, Object.keys(object));
  const $unset = {};

  for (let i = 0; i < unsetKeys.length; i++) {
    $unset[unsetKeys[i]] = 1;
  }

  const modifiers = {};
  if (Object.keys(object).length > 0) {
    modifiers.$set = object;
  }
  if (unsetKeys.length > 0) {
    modifiers.$unset = $unset;
  }
  return modifiers;
}

export default createMongoModifier;
