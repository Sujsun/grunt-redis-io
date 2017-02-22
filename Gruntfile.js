/*
 * Title: grunt-redis-io
 * GIT: https://github.com/Sujsun/grunt-redis-io
 * Author: Sundarasan Natarajan
 * Copyright (c) 2017 MIT
 */

'use strict';

module.exports = function(grunt) {

  var buildId = new Date().getTime();

  // Project configuration.
  grunt.initConfig({

    redis_io: {

      task1: {
        port: 6379,
        host: '127.0.0.1',
        operations: [
          {
            method: 'set',
            key: 'name',
            value: 'Sweet'
          }, {
            method: 'get',
            key: 'name',
            callback: function (err, value) {
              console.log('Value from Redis Cache:', value);
            },
          }
        ]
      },

      task2: {
        port: 6379,
        host: '127.0.0.1',
        operations: [
          {
            method: 'del',
            key: 'name'
          }, {
            method: 'get',
            key: 'name',
            callback: function (err, value) {
              console.log('Value from Redis Cache:', value);
            },
          }
        ]
      },

    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  grunt.registerTask('test', ['redis_io']);
  grunt.registerTask('default', ['test']);

};
