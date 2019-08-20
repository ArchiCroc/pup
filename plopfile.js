const requireField = (fieldName) => {
  return (value) => {
    if (String(value).length === 0) {
      return `${fieldName} is required`;
    }
    return true;
  };
};

const componentGenerator = require('./generators/component');
const pageGenerator = require('./generators/page');
const hookGenerator = require('./generators/hook');

module.exports = (plop) => {
  plop.setGenerator('component', componentGenerator);

  plop.setGenerator('page', pageGenerator);

  plop.setGenerator('hook', hookGenerator);
};
