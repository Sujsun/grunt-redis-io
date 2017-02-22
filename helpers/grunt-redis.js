/*
 * Title: grunt-redis-io
 * GIT: https://github.com/Sujsun/grunt-redis-io
 * Author: Sundarasan Natarajan
 * Copyright (c) 2017 MIT
 */

var redis = require('redis'),
  Promise = require('bluebird'),
  FALLBACK_LOGGER = function () {
    console.log.apply(console, arguments)
  };

/**
 * Promisifying redis client methods 
 */
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

/**
 * ------------
 * Grunt Redis
 * ------------
 */
function GruntRedis (params, options) {
  typeof(this.options) === 'object' || (this.options = {});
  this.grunt = this.options.grunt || { log: { writeln: FALLBACK_LOGGER, error: FALLBACK_LOGGER, } };
  this.params = params;
  this._validateParams();
}

GruntRedis.prototype.connect = function () {
  var self = this;
  this._client = this._createClient();
  this._attachClientEvents();
  return new Promise(function (resolve, reject) {
    self._connectResolve = resolve;
    self._connectReject = reject;
  });
};

GruntRedis.prototype.processOperationQueue = function () {
  var self = this;
  return this._processOperationQueue().then(function () {
    return self._quitClientConnection();
  }).then(function () {
    self.grunt.log.writeln('Done Redis Operations.'.bold);
  });
};

GruntRedis.prototype._createClient = function () {
  return redis.createClient(this.params.port, this.params.host);
};

GruntRedis.prototype._quitClientConnection = function () {
  var self = this;
  this._client.quit();
  return new Promise(function (resolve, reject) {
    self._quitResolve = resolve;
    self._quitReject = reject;
  });
};

GruntRedis.prototype._attachClientEvents = function () {
  var self = this;
  if (this._client) {
    this._client.on('connect', function () { self._onRedisClientConnect.apply(self, arguments); });
    this._client.on('ready', function () { self._onRedisClientReady.apply(self, arguments); });
    this._client.on('reconnecting', function () { self._onRedisClientReconnect.apply(self, arguments); });
    this._client.on('error', function () { self._onRedisClientError.apply(self, arguments); });
    this._client.on('end', function () { self._onRedisClientEnd.apply(self, arguments); });
  }
};

GruntRedis.prototype._onRedisClientConnect = function () {
  // this.grunt.log.writeln('Connected with redis server.');
  this._connectResolve();
};

GruntRedis.prototype._onRedisClientReady = function () {
  // this.grunt.log.writeln('Redis client is ready.');
};

GruntRedis.prototype._onRedisClientReconnect = function () {
  // this.grunt.log.writeln('Reconnected with redis server.');
};

GruntRedis.prototype._onRedisClientError = function (err) {
  // this.grunt.log.error('Failed to connect to redis server. Error: ' + err);
  this._connectReject();
};

GruntRedis.prototype._onRedisClientEnd = function () {
  // this.grunt.log.error('Connection ended.');
  this._quitResolve && this._quitResolve();
};

GruntRedis.prototype._validateParams = function () {
  var isValidParams = false;
  typeof(this.params) === 'object' || (this.params = {});
  isValidParams = true;
  return isValidParams;
};

GruntRedis.prototype._processOperationQueue = function () {
  var self = this;
  this.params.operations || (this.params.operations = []);
  return Promise.each(this.params.operations, function () { 
    self._processOperation.apply(self, arguments);
  });
};

GruntRedis.prototype._processOperation = function (operation) {
  var promise,
    errorMessage;
  typeof(operation) === 'object' || (operation = {});

  switch (operation.method) {
    case 'get':
      promise = this._doGetOperation(operation);
      break;
    case 'set':
      promise = this._doSetOperation(operation);
      break;
    case 'del':
      promise = this._doDelOperation(operation);
      break;
    default:
      errorMessage = 'Unkown method. Given method: "' + operation.method + '"';
      this.grunt.log.error(errorMessage);
      promise = Promise.reject(new Error(errorMessage));
  }

  return promise;
};

GruntRedis.prototype._doGetOperation = function (operation) {
  return this._client.get(operation.key, operation.callback);
};

GruntRedis.prototype._doSetOperation = function (operation) {
  return this._client.set(operation.key, operation.value, operation.callback);
};

GruntRedis.prototype._doDelOperation = function (operation) {
  return this._client.del(operation.key, operation.callback);
};

module.exports = GruntRedis;
