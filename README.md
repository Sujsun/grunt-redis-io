# grunt-redis-io [![Build Status](https://travis-ci.org/Sujsun/grunt-redis-io.svg?branch=master)](https://travis-ci.org/Sujsun/grunt-redis-io)

> Grunt Plugin to Read/Write to Redis Server

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-redis-io --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-redis-io');
```

## The "redis_io" task

### Overview
In your project's Gruntfile, add a section named `redis_io` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({

  redis_io: {
    dist: {
      port: 6379,
      host: '127.0.0.1',
      operations: [
        {
          method: 'set',
          key: 'name',
          value: 'Sundarasan Natarajan'
        },
        {
          method: 'get',
          key: 'name',
          callback: function (err, value) {
            console.log('Value from Redis Cache:', value);
          },
        },
        {
          method: 'del',
          key: 'name'
        },
      ]
    },
  }
  
});
```

Find more information [here](https://docs.sentry.io/api/releases/post-release-files/)

### Parameters

- **port** _[Number]_ - Port number on which Redis Server is running.  
- **host** _[String]_ - Host address of Redis Server.
- **operation** _[Array<OperationObjects>]_ – I/O operations to be performed on Redis Server.

### Operations:

**Supported Method Types:**
- `set`
- `get`
- `del`

**Sample Operation Object:**
```javascript
{
  method: 'set',
  key: 'name',
  value: 'Sundarasan Natarajan',
  callback: function () {
    console.log('Name updated successfully');
  }
}
```

### Contributors
[Sundarasan Natarajan](https://github.com/sundarasan)
