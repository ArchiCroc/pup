/* eslint-disable consistent-return */

import { Meteor } from 'meteor/meteor';
import i18n from 'meteor/universe:i18n';
import normalizeMeteorUserData from './normalizeMeteorUserData';
import sendEmail from '/imports/api/libs/utils/sendEmail';

const getEmailOptions = (user) => {
  try {
    const { firstName } = user.profile;
    const productName = i18n.__('product_name');

    return {
      to: user.emails[0].address,
      from: Meteor.settings.private.supportEmail,
      subject: `[${productName}] Welcome, ${firstName}!`,
      template: 'users/welcome',
      templateVars: {
        title: `Welcome, ${firstName}!`,
        subtitle: `Here's how to get started with ${productName}.`,
        productName,
        firstName,
        welcomeUrl: Meteor.absoluteUrl('documents'), // e.g., returns http://localhost:3000/documents
      },
    };
  } catch (exception) {
    throw new Error(`[sendWelcomeEmail.getEmailOptions] ${exception.message}`);
  }
};

const validateOptions = (options) => {
  try {
    if (!options) throw new Error('options object is required.');
    if (!options.user) throw new Error('options.user is required.');
  } catch (exception) {
    throw new Error(`[sendWelcomeEmail.validateOptions] ${exception.message}`);
  }
};

export default (options) => {
  try {
    validateOptions(options);
    const user = normalizeMeteorUserData({ user: options.user });
    const emailOptions = getEmailOptions(user);

    sendEmail(emailOptions).catch((error) => {
      throw new Error(error);
    });
  } catch (exception) {
    throw new Error(`[sendWelcomeEmail] ${exception.message}`);
  }
};
