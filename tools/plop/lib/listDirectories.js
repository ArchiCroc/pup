const { readdirSync, statSync } = require('fs');
const { join } = require('path');

const listDirectories = (p) => readdirSync(p).filter((f) => statSync(join(p, f)).isDirectory());

module.exports = listDirectories;
