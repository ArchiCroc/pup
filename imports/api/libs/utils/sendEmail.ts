import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import i18n from 'meteor/universe:i18n';
import getPrivateFile from './getPrivateFile';
import templateToText from './handlebarsEmailToText';
import templateToHtml from './handlebarsEmailToHtml';

interface sendEmailOptions {
    from?: string;
    to?: string | string[];
    cc?: string | string[];
    bcc?: string | string[];
    replyTo?: string | string[];
    subject?: string;
    text?: string;
    html?: string;
    headers?: Object;
    attachments?: Object[];
}

const sendEmail = (options: sendEmailOptions, { resolve, reject }: {resolve: (value?: any) => void, reject: (error: any) => void}) => {
  try {
    Meteor.defer(() => {
      Email.send(options);
      resolve();
    });
  } catch (exception) {
    reject(exception);
  }
};

interface sendEmailProps {
  text: string;
  html: string; 
  template: string;
  templateVars: Record<string, any>;
}

export default ({ text, html, template, templateVars = {}, ...rest }: sendEmailProps) => {
  if (text || html || template) {
    return new Promise((resolve, reject) => {
      const textTemplate = template && getPrivateFile(`email-templates/${template}.txt`);
      const htmlTemplate = template && getPrivateFile(`email-templates/${template}.html`);

      const context = {
        productName: i18n.__('product_name'),
        productUrl: Meteor.absoluteUrl(), // e.g., returns http://localhost:3000/
        ...templateVars,
      };

      sendEmail(
        {
          ...rest,
          text: template ? templateToText(textTemplate, context) : text,
          html: template ? templateToHtml(htmlTemplate, context) : html,
        },
        { resolve, reject },
      );
    });
  }
  throw new Error(
    "Please pass an HTML string, text, or template name to compile for your message's body.",
  );
};
