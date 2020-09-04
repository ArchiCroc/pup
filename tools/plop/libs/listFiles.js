const { readdirSync, statSync } = require('fs');
const { join } = require('path');

const listFiles = (p, exclude = []) =>
  readdirSync(p).filter((f) => statSync(join(p, f)).isFile() && !exclude.includes(f));

module.exports = listFiles;
