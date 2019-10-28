const path = require('path');

const normalizePath = (pathString) => {
  return !path.sep || path.sep === '\\' ? pathString.replace(/\\/g, '/') : pathString;
};

module.exports = normalizePath;
