const normalizePath = (path) => {
  return !path.sep || path.sep === '\\' ? path.replace(/\\/g, '/') : path;
};

module.exports = normalizePath;
