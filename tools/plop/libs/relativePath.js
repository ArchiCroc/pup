const path = require('path');
const normalizePath = require('./normalizePath');

const relativePath = (basePath, fullPath) => {
  const rel = path.relative(basePath, fullPath);
  return normalizePath(rel);
};

module.exports = relativePath;
