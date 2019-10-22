const { readdirSync, statSync } = require('fs');
const { join } = require('path');

const listDirectories = (p, exclude = []) =>
  readdirSync(p).filter((f) => statSync(join(p, f)).isDirectory() && !exclude.includes(f));

module.exports = listDirectories;
