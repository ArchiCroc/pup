import { ObjectID } from '/imports/common/interfaces';
import { Mongo } from 'meteor/mongo'
declare module 'meteor/meteor' {
    type global_Error = Error;
    //Export all the Error types
    /** Error **/
    var Error: ErrorStatic;
    export interface ErrorStatic {
        new(error: string | number, reason?: string, details?: string): Error;
    }
    export interface Error extends global_Error {
        error: string | number;
        reason?: string;
        details?: string;
    }
    var TypedError: TypedErrorStatic;
    export interface TypedErrorStatic {
        new(message: string, errorType: string): TypedError;
    }
    export interface TypedError extends global_Error {
        message: string;
        errorType: string;
    }
    /** Error **/
    module Meteor {
        export interface User {
            roles: string[];
            settings: any;
        }
    }
}

declare module 'meteor/accounts-base' {
    type global_Error = Error;
    //Export all the Error types
    /** Error **/
    var Error: ErrorStatic;
    export interface ErrorStatic {
        new(error: string | number, reason?: string, details?: string): Error;
    }
    export interface Error extends global_Error {
        error: string | number;
        reason?: string;
        details?: string;
    }
    var TypedError: TypedErrorStatic;
    export interface TypedErrorStatic {
        new(message: string, errorType: string): TypedError;
    }
    export interface TypedError extends global_Error {
        message: string;
        errorType: string;
    }
    /** Error **/
}

module Mongo {
    export interface ObjectID {
        _str: string;
        toHexString(): string;
        equals(otherID: ObjectID): boolean;
    }
    interface ObjectIDStatic {
        new(hexString?: string): ObjectID;
        _str: string;
    }
}

//   declare module MongoInternals {
//     export interface NpmModule  {
//         ObjectID(ObjectID): ObjectID;
//     }
//   }
declare module 'meteor/mongo' {

    module Mongo {
        interface Collection extends Mongo.Collection {
            _driver: any;
            _name: string
        }
    }
    module MongoInternals {
        module NpmModule {
            class ObjectID {
                constructor(ObjectID): ObjectID
                toHexString(): string
            }
            class Timestamp {

            }
        }
        // export interface NpmModule  {
        //     ObjectID(ObjectID): ObjectID;
        // }
    }
}