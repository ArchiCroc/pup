import { Mongo } from 'meteor/mongo';
// import SimpleSchema from 'simpl-schema';

const UserSettings = new Mongo.Collection('UserSettings');

// UserSettings.allow({
//   insert: () => false,
//   update: () => false,
//   remove: () => false,
// });

// UserSettings.deny({
//   insert: () => true,
//   update: () => true,
//   remove: () => true,
// });

// UserSettings.attachSchema(UserSettingsSchema);

export default UserSettings;
