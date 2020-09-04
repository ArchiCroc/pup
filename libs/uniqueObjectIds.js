import { Mongo } from 'meteor/mongo';

function distinct(value, index, self) {
  return self.indexOf(value) === index;
}

const uniqueObjectIds = (objectsIds) => {
  return objectsIds
    .map((item) => item._str)
    .filter(distinct)
    .map((item) => new Mongo.ObjectID(item));
};

export default uniqueObjectIds;
