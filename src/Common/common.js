/**
 *
 * @author     richen
 * @copyright  Copyright (c) 2014- <ric3000(at)163.com>
 * @license    MIT
 * @version    15/1/15
 */
'use strict';

var fs = require('fs');
var path = require('path');
var util = require('util');
var crypto = require('crypto');
var net = require('net');

//Object上toString方法
global.toString = Object.prototype.toString;

/**
 * 获取对象的值
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
Object.values = function (obj) {
    var values = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            values.push(obj[key])
        }
    }
    return values;
};
/**
 * 日期格式化
 * @param formatStr
 * YYYY/yyyy/YY/yy 表示年份
 * MM/M 月份
 * W/w 星期
 * dd/DD/d/D 日期
 * hh/HH/h/H 小时
 * mi/MI 分钟
 * ss/SS 秒
 * @returns {*}
 * @constructor
 */
Date.prototype.Format = function (formatStr) {
    var str = formatStr;
    var Week = ['日', '一', '二', '三', '四', '五', '六'];
    str = str.replace(/yyyy|YYYY/, this.getFullYear());
    str = str.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() % 100));
    str = str.replace(/mi|MI/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
    str = str.replace(/mm|MM/, this.getMonth() + 1 > 9 ? (this.getMonth() + 1).toString() : '0' + (this.getMonth() + 1));
    str = str.replace(/m|M/g, this.getMonth() + 1);
    str = str.replace(/w|W/g, Week[this.getDay()]);
    str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
    str = str.replace(/d|D/g, this.getDate());
    str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
    str = str.replace(/h|H/g, this.getHours());
    str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
    return str;
};
/**
 * check object is http object
 * @param  {Mixed}  obj []
 * @return {Boolean}      []
 */
global.isHttp = function (obj) {
    return !!(obj && isObject(obj.req) && isObject(obj.res));
};
/**
 * 是否是boolean
 * @param  {[type]}  obj
 * @return {Boolean}
 */
global.isBoolean = function (obj) {
    return toString.call(obj) === '[object Boolean]';
};
/**
 * 是否是数字
 * @param  {[type]}  obj [description]
 * @return {Boolean}     [description]
 */
global.isNumber = function (obj) {
    return toString.call(obj) === '[object Number]';
};
/**
 * 是否是个对象
 * @param  {[type]}  obj [description]
 * @return {Boolean}     [description]
 */
global.isObject = function (obj) {
    if (isBuffer(obj)) {
        return false;
    }
    return toString.call(obj) === '[object Object]';
};
/**
 * 是否是字符串
 * @param  {[type]}  obj [description]
 * @return {Boolean}     [description]
 */
global.isString = function (obj) {
    return toString.call(obj) === '[object String]';
};
/**
 * 是否是个function
 * @param  {[type]}  obj [description]
 * @return {Boolean}     [description]
 */
global.isFunction = function (obj) {
    return typeof obj === 'function';
};
/**
 * 是否是日期
 * @return {Boolean} [description]
 */
global.isDate = function (obj) {
    return util.isDate(obj);
};
/**
 * 是否是正则
 * @param  {[type]}  reg [description]
 * @return {Boolean}     [description]
 */
global.isRegexp = function (obj) {
    return util.isRegExp(obj);
};
/**
 * 是否是个错误
 * @param  {[type]}  obj [description]
 * @return {Boolean}     [description]
 */
global.isError = function (obj) {
    return util.isError(obj);
};
/**
 * 判断对象是否为空
 * @param  {[type]}  obj
 * @return {Boolean}
 */
global.isEmpty = function (obj) {
    if (isObject(obj)) {
        var key;
        for (key in obj) {
            return false;
        }
        return true;
    } else if (isArray(obj)) {
        return obj.length === 0;
    } else if (isString(obj)) {
        return obj.length === 0;
    } else if (isNumber(obj)) {
        return obj === 0;
    } else if (obj === null || obj === undefined) {
        return true;
    } else if (isBoolean(obj)) {
        return !obj;
    }
    return false;
};
/**
 * 是否是个标量
 * @param  {[type]}  obj [description]
 * @return {Boolean}     [description]
 */
global.isScalar = function (obj) {
    return isBoolean(obj) || isNumber(obj) || isString(obj);
};
/**
 * 是否是个数组
 * @type {Boolean}
 */
global.isArray = Array.isArray;
/**
 * 是否是IP
 * @type {Boolean}
 */
global.isIP = net.isIP;
global.isIP4 = net.isIP4;
global.isIP6 = net.isIP6;
/**
 * 是否是个文件
 * @param  {[type]}  p [description]
 * @return {Boolean}   [description]
 */
global.isFile = function (p) {
    if (!fs.existsSync(p)) {
        return false;
    }
    var stats = fs.statSync(p);
    return stats.isFile();
};
/**
 * 是否是个目录
 * @param  {[type]}  p [description]
 * @return {Boolean}   [description]
 */
global.isDir = function (p) {
    if (!fs.existsSync(p)) {
        return false;
    }
    var stats = fs.statSync(p);
    return stats.isDirectory();
};
/**
 * 是否是buffer
 * @type {Boolean}
 */
global.isBuffer = Buffer.isBuffer;
/**
 * 是否是个数字的字符串
 * @param  {[type]}  obj [description]
 * @return {Boolean}     [description]
 */
var numberReg = /^((\-?\d*\.?\d*(?:e[+-]?\d*(?:\d?\.?|\.?\d?)\d*)?)|(0[0-7]+)|(0x[0-9a-f]+))$/i;
global.isNumberString = function (obj) {
    return numberReg.test(obj);
};
/**
 * 判断一个文件或者目录是否可写
 * @param  {[type]}  p [description]
 * @return {Boolean}      [description]
 */
global.isWritable = function (p) {
    if (!fs.existsSync(p)) {
        return false;
    }
    var stats = fs.statSync(p);
    var mode = stats.mode;
    var uid = process.getuid ? process.getuid() : 0;
    var gid = process.getgid ? process.getgid() : 0;
    var owner = uid === stats.uid;
    var group = gid === stats.gid;
    return !!(owner && (mode & parseInt('00200', 8)) ||
    group && (mode & parseInt('00020', 8)) ||
    (mode & parseInt('00002', 8)));
};

/**
 * 递归创建目录，同步模式
 * @param  {[type]} p    [description]
 * @param  {[type]} mode [description]
 * @return {[type]}      [description]
 */
global.mkdir = function (p, mode) {
    mode = mode || '0777';
    if (fs.existsSync(p)) {
        chmod(p, mode);
        return true;
    }
    var pp = path.dirname(p);
    if (fs.existsSync(pp)) {
        fs.mkdirSync(p, mode);
    } else {
        mkdir(pp, mode);
        mkdir(p, mode);
    }
    return true;
};

/**
 * 读取文件
 * @param filename 文件物理路径
 * @param enc      为空返回Buffer类型,'utf8'返回String类型
 * @returns {Promise}
 */
global.mReadFile = function (filename, enc) {
    return new Promise(function (fulfill, reject) {
        fs.readFile(filename, enc, function (err, res) {
            if (err) reject(err);
            else fulfill(res);
        });
    });
};
/**
 * 写入文件
 * @param filename 文件物理路径
 * @param data     Buffer数据
 * @returns {Promise}
 */
global.mWriteFile = function (filename, data) {
    return new Promise(function (fulfill, reject) {
        fs.writeFile(filename, data, function (err, res) {
            if (err) reject(err);
            else fulfill(res);
        })
    });
};
/**
 * 修改文件名，支持移动
 * @param filename 原文件名
 * @param sfilename 新文件名
 * @returns {Promise}
 */
global.mReName = function (filename, nfilename) {
    return new Promise(function (fulfill, reject) {
        fs.rename(filename, nfilename, function (err, res) {
            if (err) reject(err);
            else fulfill(res);
        });
    });
};

/**
 * 递归的删除目录，返回promise
 * @param  string p       要删除的目录
 * @param  boolean reserve 是否保留当前目录，只删除子目录
 * @return Promise
 */
global.rmdir = function (p, reserve) {
    if (!isDir(p)) {
        return getPromise();
    }
    var deferred = getDefer();
    fs.readdir(p, function (err, files) {
        if (err) {
            return deferred.reject(err);
        }
        var promises = files.map(function (item) {
            var filepath = path.normalize(p + '/' + item);
            if (isDir(filepath)) {
                return rmdir(filepath, false);
            } else {
                var deferred = getDefer();
                fs.unlink(filepath, function (err) {
                    return err ? deferred.reject(err) : deferred.resolve();
                });
                return deferred.promise;
            }
        });
        var promise = files.length === 0 ? getPromise() : Promise.all(promises);
        return promise.then(function () {
            if (!reserve) {
                var deferred = getDefer();
                fs.rmdir(p, function (err) {
                    return err ? deferred.reject(err) : deferred.resolve();
                });
                return deferred.promise;
            }
        }).then(function () {
            deferred.resolve();
        }).catch(function (err) {
            deferred.reject(err);
        })
    });
    return deferred.promise;
};
/**
 * 修改目录或者文件权限
 * @param  {[type]} p    [description]
 * @param  {[type]} mode [description]
 * @return {[type]}      [description]
 */
global.chmod = function (p, mode) {
    mode = mode || '0777';
    if (!fs.existsSync(p)) {
        return true;
    }
    return fs.chmodSync(p, mode);
};
/**
 * 获取文件内容
 * @param  {[type]} file [description]
 * @return {[type]}      [description]
 */
global.getFileContent = function (file, encoding) {
    if (!fs.existsSync(file)) {
        return '';
    }
    return fs.readFileSync(file, encoding || 'utf8');
};
/**
 * 设置文件内容
 * @param  {[type]} file [description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
global.setFileContent = function (file, data) {
    var filepath = path.dirname(file);
    mkdir(filepath);
    return fs.writeFileSync(file, data);
};
/**
 * 大写首字符
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
global.ucfirst = function (name) {
    name = (name || '') + '';
    return name.substr(0, 1).toUpperCase() + name.substr(1).toLowerCase();
};
/**
 * 获取字符串的md5
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
global.md5 = function (str) {
    var instance = crypto.createHash('md5');
    instance.update(str + '');
    return instance.digest('hex');
};
/**
 * 字符串或文件hash,比md5效率高,但是有很低的概率重复
 * @param input
 * @returns {string}
 */
global.hash = function (input) {
    var hash = 5381;
    var I64BIT_TABLE =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split('');
    var i = input.length - 1;

    if (typeof input === 'string') {
        for (; i > -1; i--)
            hash += (hash << 5) + input.charCodeAt(i);
    }
    else {
        for (; i > -1; i--)
            hash += (hash << 5) + input[i];
    }
    var value = hash & 0x7FFFFFFF;

    var retValue = '';
    do {
        retValue += I64BIT_TABLE[value & 0x3F];
    }
    while (value >>= 6);

    return retValue;
};
/**
 * 获取随机整数
 * @return {[type]} [description]
 */
global.rand = function (min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
};
/**
 * 快速生成一个object
 * @param  {[type]} key   [description]
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */
global.getObject = function (key, value) {
    var obj = {};
    if (!isArray(key)) {
        obj[key] = value;
        return obj;
    }
    key.forEach(function (item, i) {
        obj[item] = value[i];
    });
    return obj;
};
/**
 * 将数组变成对象
 * @param  {[type]} arr       [description]
 * @param  {[type]} key       [description]
 * @param  {[type]} valueKeys [description]
 * @return {[type]}           [description]
 */
global.arrToObj = function (arr, key, valueKey) {
    var result = {};
    var arrResult = [];
    arr.forEach(function (item) {
        var keyValue = item[key];
        if (valueKey === null) {
            arrResult.push(keyValue);
        } else if (valueKey) {
            result[keyValue] = item[valueKey];
        } else {
            result[keyValue] = item;
        }
    });
    return valueKey === null ? arrResult : result;
};
/**
 * 数组去重
 * @param arr
 * @returns {Array}
 */
global.unique = function (arr) {
    var result = [], hash = {};
    for (var i = 0, elem; (elem = arr[i]) != null; i++) {
        if (!hash[elem]) {
            result.push(elem);
            hash[elem] = true;
        }
    }
    return result;
};

//数组删除元素
global.arrayRemove = function (array, toDeleteIndexes) {
    var result = [];
    for (var i = 0; i < array.length; i++) {
        var needDelete = false;
        for (var j = 0; j < toDeleteIndexes.length; j++) {
            if (i == toDeleteIndexes[j]) {
                needDelete = true;
                break;
            }
        }
        if (!needDelete) {
            result.push(array[i]);
        }
    }
    return result;
};