import { Mongo, MongoInternals } from 'meteor/mongo';
import { ObjectID } from '/imports/common/interfaces';
// eslint-disable-next-line import/prefer-default-export
export function convertObjectIdToNativeId(value: ObjectID): any {
  if (value instanceof Mongo.ObjectID) {
    return new MongoInternals.NpmModule.ObjectID(value._str);
  }

  return value;
}

export default function convertMeteorToMongo(document: any): any {
  if (Array.isArray(document)) {
    const newArray = [];
    for (let i = 0; i < document.length; i++) {
      const value = document[i];
      newArray[i] = convertMeteorToMongo(value);
    }
    return newArray;
  }
  if (document instanceof Mongo.ObjectID) {
    return new MongoInternals.NpmModule.ObjectID(document.toHexString());
  }

  if (document instanceof Date) {
    return document;
  }

  if (document instanceof Object) {
    const newObject: any = {};
    for (let [key, value] of Object.entries(document)) {
      newObject[key] = convertMeteorToMongo(value);
    }
    return newObject;
  }
  return convertObjectIdToNativeId(document);
}
