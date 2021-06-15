import { Meteor } from 'meteor/meteor';

Meteor.publish('app', function app() {
  const query: any = { _id: this.userId };
  return [Meteor.users.find(query)];
});
