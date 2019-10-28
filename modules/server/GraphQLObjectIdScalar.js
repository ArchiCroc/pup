import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
// import { ObjectID } from 'mongodb'
import { Mongo } from 'meteor/mongo';

// eslint-disable-next-line import/prefer-default-export
export const ObjectID = new GraphQLScalarType({
  name: 'ObjectID',
  description:
    'The `ObjectID` scalar type represents a [`BSON`](https://en.wikipedia.org/wiki/BSON) ID commonly used in `mongodb`.',
  serialize(_id) {
    // value sent to the client
    if (_id instanceof Mongo.ObjectID) {
      return _id.toHexString();
    }
    if (typeof _id === 'string') {
      return _id;
    }
    throw new Error(`${Object.getPrototypeOf(_id).constructor.name} not convertible to string`);
  },
  parseValue(_id) {
    // value from the client
    if (typeof _id === 'string') {
      return new Mongo.ObjectID(_id);
    }
    if (typeof _id === 'object' && _id._str) {
      return new Mongo.ObjectID(_id._str);
    }
    throw new Error(`${typeof _id} not convertible to ObjectID`);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Mongo.ObjectID(ast.value);
    }
    throw new Error(`${ast.kind} not convertible to ObjectID`);
  },
});
