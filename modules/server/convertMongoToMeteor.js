import { Mongo, MongoInternals } from 'meteor/mongo';

// eslint-disable-next-line import/prefer-default-export
export function convertNativeIdToObjectId(value) {
  if (value instanceof MongoInternals.NpmModule.ObjectID) {
    return new Mongo.ObjectID(value.toHexString());
  }

  return value;
}

export default function convertMongoToMeteor(document) {
  if (Array.isArray(document)) {
    const newArray = [];
    for (let i = 0; i < document.length; i++) {
      const value = document[i];
      newArray[i] = convertMongoToMeteor(value);
    }
    return newArray;
  }
  if (document instanceof MongoInternals.NpmModule.ObjectID) {
    return new Mongo.ObjectID(document.toHexString());
  }

  if (document instanceof MongoInternals.NpmModule.Timestamp || document instanceof Date) {
    return document;
  }

  if (document instanceof Object) {
    const newObject = {};
    for (let [key, value] of Object.entries(document)) {
      newObject[key] = convertMongoToMeteor(value);
      // console.log(key, value instanceof MongoInternals.NpmModule.ObjectID);
      // if (key === 'createdAtUTC') {
      //   console.log(key, value, value instanceof Date, value.);
      // }
    }
    return newObject;
  }
  return document;
}
