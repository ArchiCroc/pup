declare module 'meteor/apollo' {
    import { ApolloLink } from '@apollo/client';
    import { Meteor } from 'meteor/meteor';

    export declare function MeteorAccountsLink(): ApolloLink;
    export declare function getUser(authorization?: string): Meteor.User;
}