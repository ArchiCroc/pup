'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  options: function options(_options) {
    if (!_options.schema) throw new Error('[PupQL] Woah there, pup! You need to pass a GraphQL schema for us.');
  }
};