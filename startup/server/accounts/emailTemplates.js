import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import getPrivateFile from '../../../libs/server/getPrivateFile';
import templateToHtml from '../../../libs/server/handlebarsEmailToHtml';
import templateToText from '../../../libs/server/handlebarsEmailToText';

const { emailTemplates } = Accounts;
const { productName } = Meteor.settings.public;

emailTemplates.siteName = productName;
emailTemplates.from = Meteor.settings.private.supportEmail;

emailTemplates.verifyEmail = {
  subject() {
    return `[${productName}] Verify Your Email Address`;
  },
  html(user, url) {
    return templateToHtml(getPrivateFile('email-templates/users/verify-email.html'), {
      title: "Let's Verify Your Email",
      subtitle: `Verify your email to start using ${productName}.`,
      productName,
      firstName: user.profile.firstName,
      verifyUrl: url.replace('#/', ''),
    });
  },
  text(user, url) {
    const urlWithoutHash = url.replace('#/', '');
    if (Meteor.isDevelopment) console.info(`[Pup] Verify Email Link: ${urlWithoutHash}`); // eslint-disable-line
    return templateToText(getPrivateFile('email-templates/users/verify-email.txt'), {
      productName,
      firstName: user.profile.firstName,
      verifyUrl: urlWithoutHash,
    });
  },
};

emailTemplates.resetPassword = {
  subject() {
    return `[${productName}] Reset Your Password`;
  },
  html(user, url) {
    return templateToHtml(getPrivateFile('email-templates/users/reset-password.html'), {
      title: "Let's Reset Your Password",
      subtitle: 'A password reset was requested for this email address.',
      firstName: user.profile.firstName,
      productName,
      emailAddress: user.emails[0].address,
      resetUrl: url.replace('#/', ''),
    });
  },
  text(user, url) {
    const urlWithoutHash = url.replace('#/', '');
    if (Meteor.isDevelopment) console.info(`Reset Password Link: ${urlWithoutHash}`); // eslint-disable-line
    return templateToText(getPrivateFile('email-templates/users/reset-password.txt'), {
      firstName: user.profile.firstName,
      productName,
      emailAddress: user.emails[0].address,
      resetUrl: urlWithoutHash,
    });
  },
};
