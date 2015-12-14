/**
 * jade模版引擎
 * expressjs默认为该模版引擎
 * @type {[type]}
 */
'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _jade = require('jade');

var _jade2 = _interopRequireDefault(_jade);

var _ThinkBaseJs = require('../../Think/Base.js');

var _ThinkBaseJs2 = _interopRequireDefault(_ThinkBaseJs);

var _default = (function (_base) {
    _inherits(_default, _base);

    function _default() {
        _classCallCheck(this, _default);

        _base.apply(this, arguments);
    }

    _default.prototype.init = function init() {
        var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        this.config = extend(false, C('tpl_engine_config'), config);
    };

    /**
     *
     * @param templateFile
     */

    _default.prototype.fetch = function fetch(templateFile, data) {
        this.config.filename = templateFile;
        var content = getFileContent(templateFile);
        return _jade2['default'].compile(content, this.config)(data);
    };

    return _default;
})(_ThinkBaseJs2['default']);

exports['default'] = _default;
module.exports = exports['default'];