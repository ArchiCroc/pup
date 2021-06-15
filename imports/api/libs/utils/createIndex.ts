/* eslint-disable */

import { Mongo } from 'meteor/mongo';

export default (Collection: any, index: any, options?: any) => {
  if (Collection && Collection instanceof Mongo.Collection) {
    Collection.rawCollection().createIndex(index, options);
  } else {
    console.warn(
      '[/api/libs/utils/createIndex.js] Must pass a MongoDB collection instance to define index on.',
    );
  }
};
