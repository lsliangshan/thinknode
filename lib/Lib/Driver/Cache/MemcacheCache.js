/**
 *
 * @author     richen
 * @copyright  Copyright (c) 2015 - <ric3000(at)163.com>
 * @license    MIT
 * @version    15/12/3
 */
'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _ThinkCacheJs = require('../../Think/Cache.js');

var _ThinkCacheJs2 = _interopRequireDefault(_ThinkCacheJs);

var _SocketMemcacheSocketJs = require('../Socket/MemcacheSocket.js');

var _SocketMemcacheSocketJs2 = _interopRequireDefault(_SocketMemcacheSocketJs);

var _default = (function (_cache) {
    _inherits(_default, _cache);

    function _default() {
        _classCallCheck(this, _default);

        _cache.apply(this, arguments);
    }

    _default.prototype.init = function init(options) {
        _cache.prototype.init.call(this, options);

        var key = md5(JSON.stringify(this.options));
        if (!(key in THINK.INSTANCES.MEMCACHE)) {
            THINK.INSTANCES.MEMCACHE[key] = _SocketMemcacheSocketJs2['default'](this.options.memcache_port, this.options.memcache_host);
        }
        this.handle = THINK.INSTANCES.MEMCACHE[key];
    };

    /**
     *
     * @param name
     */

    _default.prototype.get = function get(name) {
        var value;
        return _regeneratorRuntime.async(function get$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return _regeneratorRuntime.awrap(this.handle.get(this.options.cache_key_prefix + name));

                case 2:
                    value = context$2$0.sent;
                    return context$2$0.abrupt('return', value ? JSON.parse(value) : value);

                case 4:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    };

    /**
     *
     * @param name
     * @param value
     * @param timeout
     */

    _default.prototype.set = function set(name, value) {
        var timeout = arguments.length <= 2 || arguments[2] === undefined ? this.options.cache_timeout : arguments[2];

        return this.handle.set(this.options.cache_key_prefix + name, JSON.stringify(value), timeout);
    };

    /**
     *
     * @param name
     */

    _default.prototype.rm = function rm(name) {
        return this.handle.rm(this.options.cache_key_prefix + name);
    };

    return _default;
})(_ThinkCacheJs2['default']);

exports['default'] = _default;
module.exports = exports['default'];