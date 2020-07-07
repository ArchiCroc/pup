const prettier = require('prettier');

const prettierTransform = (text) =>
  prettier.resolveConfig('./').then((options) => {
    return prettier.format(text, options);
  });

module.exports = prettierTransform;
