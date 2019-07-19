'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _subscriptionsTransportWs = require('subscriptions-transport-ws');

var _graphql = require('graphql');

var _graphqlTools = require('graphql-tools');

var _validators = require('./lib/validators');

var _validators2 = _interopRequireDefault(_validators);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (options) {
  _validators2.default.options(options);

  // NOTE: Conditionally load apollo-server variant if user has an existing server.
  var existingWebServer = options.config && options.config.existingWebServer;
  var existingWebSocketServer = options.config && options.config.existingWebSocketServer;

  var _ref = existingWebServer ? require('apollo-server-express') : require('apollo-server'),
      ApolloServer = _ref.ApolloServer,
      PubSub = _ref.PubSub;

  var pubsub = new PubSub();
  var server = new ApolloServer((0, _extends3.default)({}, options.schema, {
    context: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(params) {
        var customContext;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!options.context) {
                  _context.next = 6;
                  break;
                }

                _context.next = 3;
                return options.context(params);

              case 3:
                _context.t0 = _context.sent;
                _context.next = 7;
                break;

              case 6:
                _context.t0 = {};

              case 7:
                customContext = _context.t0;
                return _context.abrupt('return', (0, _extends3.default)({
                  pubsub: pubsub
                }, customContext));

              case 9:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined);
      }));

      function context(_x) {
        return _ref2.apply(this, arguments);
      }

      return context;
    }(),
    uploads: false
  }));

  if (existingWebServer) {
    server.applyMiddleware({
      app: existingWebServer,
      path: options.config.path || '/graphql'
    });
  } else {
    server.listen({ port: options && options.config && options.config.port || 4000 }).then(function (_ref3) {
      var url = _ref3.url;

      console.log('[PupQL] Woof! Your GraphQL server is ready at ' + url);
    });
  }

  var websocketServer = _http2.default.createServer(function (request, response) {
    response.writeHead(200);
    response.end();
  });

  websocketServer.listen(4001);

  _subscriptionsTransportWs.SubscriptionServer.create({
    schema: (0, _graphqlTools.makeExecutableSchema)((0, _extends3.default)({}, options.schema)),
    execute: _graphql.execute,
    subscribe: _graphql.subscribe,
    onConnect: function onConnect() {
      console.log('[PupQL] Woof! Subscription client connected...');
      return { pubsub: pubsub };
    },
    onDisconnect: function onDisconnect() {
      console.log('[PupQL] Woof! Subscription client disconnected...');
    }
  }, {
    server: websocketServer,
    path: '/graphql'
  });

  // NOTE: Centralize handling of nested Promise errors here so we don't
  // have to have a bunch of .catch() callbacks and repetition.
  if (process && process.on) {
    process.on('unhandledRejection', function (error) {
      console.warn('[PupQL] ' + error);
    });
  }

  return server;
};