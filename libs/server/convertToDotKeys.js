import { Mongo } from 'meteor/mongo';

export const convertToDotKeys = function convertToDotKeys(obj, parent = [], keyValue = {}) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const keyPath = [...parent, key];
      if (
        obj[key] &&
        typeof obj[key] === 'object' &&
        !(obj[key] instanceof Mongo.ObjectID) &&
        !(obj[key] instanceof Date) &&
        !Array.isArray(obj[key])
      ) {
        Object.assign(keyValue, convertToDotKeys(obj[key], keyPath, keyValue));
      } else {
        keyValue[keyPath.join('.')] = obj[key];
      }
    }
  }
  return keyValue;
};

export default convertToDotKeys;
