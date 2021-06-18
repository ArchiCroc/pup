import { Mongo } from 'meteor/mongo';

export default function (_id: any) {
  if (typeof _id === 'string') {
    return new Mongo.ObjectID(_id);
  }
  return _id;
}
