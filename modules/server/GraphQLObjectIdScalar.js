import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
// import { ObjectID } from 'mongodb'
import { Mongo } from 'meteor/mongo';

export default {
  ObjectID: new GraphQLScalarType({
    name: 'ObjectID',
    description:
      'The `ObjectID` scalar type represents a [`BSON`](https://en.wikipedia.org/wiki/BSON) ID commonly used in `mongodb`.',
    serialize(_id) {
      if (_id instanceof Mongo.Mongo.ObjectID) {
        return _id.toHexString();
      }
      if (typeof _id === 'string') {
        return _id;
      }
      throw new Error(`${Object.getPrototypeOf(_id).constructor.name} not convertible to `);
    },
    parseValue(_id) {
      if (typeof _id === 'string') {
        return Mongo.ObjectID.createFromHexString(_id);
      }
      throw new Error(`${typeof _id} not convertible to ObjectID`);
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return Mongo.ObjectID.createFromHexString(ast.value);
      }
      throw new Error(`${ast.kind} not convertible to ObjectID`);
    },
  }),
};
