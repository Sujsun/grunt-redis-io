/*
 * Title: grunt-redis-io
 * GIT: https://github.com/Sujsun/grunt-redis-io
 * Author: Sundarasan Natarajan
 * Copyright (c) 2017 MIT
 */

'use strict';
var grunt,
  GruntRedis = require('../helpers/grunt-redis');

module.exports = function(gruntArg) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks
  grunt = gruntArg;
  
  grunt.registerMultiTask('redis_io', 'Grunt plugin to read/write to redis server', function () {

    var done = this.async();
    var params = {
      port: this.data.port,
      host: this.data.host,
      operations: this.data.operations,
    };
    var gruntRedis = new GruntRedis(params, { grunt: grunt, });

    gruntRedis.connect().catch(function (err) {
      done(err || new Error('Failed to connect to redis server'));
    });

    return gruntRedis.processOperationQueue().then(function () {
      done();
    }).catch(function (err) {
      done(err || new Error('Failed to do operations'));
    });

  });

};
