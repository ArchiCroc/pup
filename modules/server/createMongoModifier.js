import difference from 'lodash/difference';
import convertToDotKeys from './convertToDotKeys';

const typesToSkip = ['object'];

function createMongoModifier(currentObject, newObject) {
  currentObject = convertToDotKeys(currentObject);
  newObject = convertToDotKeys(newObject);
  const unsetKeys = difference(Object.keys(currentObject), Object.keys(newObject));
  const $unset = {};

  for (let i = 0; i < unsetKeys.length; i++) {
    const key = unsetKeys[i];

    // @todo this needs more testing
    //const { type } = currentSchema[key].type.definitions[0];
    //console.log('type', key, typeof type, type);
    // if (typesToSkip.includes(typeof type)) {
    $unset[key] = 1;
    // }
  }

  const modifiers = {};
  if (Object.keys(newObject).length > 0) {
    modifiers.$set = newObject;
  }
  if (Object.keys($unset).length > 0) {
    modifiers.$unset = $unset;
  }
  return modifiers;
}

export default createMongoModifier;
