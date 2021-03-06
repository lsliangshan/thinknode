'use strict';

exports.__esModule = true;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _Cache = require('./Cache');

var _Cache2 = _interopRequireDefault(_Cache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * @author     richen
 * @copyright  Copyright (c) 2015 - <richenlin(at)gmail.com>
 * @license    MIT
 * @version    15/12/2
 */
var _class = function (_cache) {
    (0, _inherits3.default)(_class, _cache);

    function _class() {
        (0, _classCallCheck3.default)(this, _class);
        return (0, _possibleConstructorReturn3.default)(this, _cache.apply(this, arguments));
    }

    _class.prototype.init = function init(options) {
        _cache.prototype.init.call(this, options);
        this.cachePath = this.options.cache_path + '/' + this.options.cache_key_prefix + '/Cache';
        this.options.gctype = 'fileCache';
        THINK.GCTIMER(this);
    };

    _class.prototype.getFilePath = function getFilePath(name) {
        var tmp = THINK.hash(name).split('').slice(0, 1) || '';
        var dir = this.cachePath + '/' + tmp;
        THINK.isDir(dir) || THINK.mkDir(dir);
        return dir + '/' + name + this.options.cache_file_suffix;
    };

    /**
     *
     * @param name
     */


    _class.prototype.get = function get(name) {
        var file = this.getFilePath(name);
        if (!THINK.isFile(file)) {
            return _promise2.default.resolve('');
        }
        var fn = THINK.promisify(_fs2.default.readFile, _fs2.default);
        return fn(file, { encoding: 'utf8' }).then(function (data) {
            if (!data) {
                return '';
            }
            try {
                data = JSON.parse(data);
                if (Date.now() > (data.expire || 0)) {
                    _fs2.default.unlink(file, function () {});
                    return '';
                } else {
                    return data.data;
                }
            } catch (e) {
                _fs2.default.unlink(file, function () {});
                return '';
            }
        }).catch(function () {
            return '';
        });
    };

    /**
     *
     * @param name
     * @param value
     * @param timeout
     */


    _class.prototype.set = function set(name, value, timeout) {
        if (timeout === undefined) {
            timeout = this.options.cache_timeout;
        }
        var file = this.getFilePath(name);
        var data = {
            data: value,
            expire: Date.now() + timeout * 1000,
            timeout: timeout
        };
        var fn = THINK.promisify(_fs2.default.writeFile, _fs2.default);
        return fn(file, (0, _stringify2.default)(data)).then(function () {
            //修改缓存文件权限，避免不同账号下启动时可能会出现无权限的问题
            THINK.chmod(file);
        });
    };

    /**
     *
     * @param name
     */


    _class.prototype.rm = function rm(name) {
        var file = this.getFilePath(name);
        if (THINK.isFile(file)) {
            var fn = THINK.promisify(_fs2.default.unlink, _fs2.default);
            return fn(file);
        }
        return _promise2.default.resolve();
    };

    /**
     *
     * @param now
     * @param path
     */


    _class.prototype.gc = function gc() {
        var _this2 = this;

        var now = arguments.length <= 0 || arguments[0] === undefined ? Date.now() : arguments[0];
        var path = arguments[1];

        //缓存回收
        path = path || this.cachePath;
        var files = _fs2.default.readdirSync(path);
        files.forEach(function (item) {
            var file = path + '/' + item;
            if (THINK.isDir(file)) {
                _this2.gc(now, file);
            } else {
                var data = THINK.getFileContent(file);
                try {
                    data = JSON.parse(data);
                    if (now > data.expire) {
                        _fs2.default.unlink(file, function () {});
                    }
                } catch (e) {}
            }
        });
    };

    return _class;
}(_Cache2.default);

exports.default = _class;