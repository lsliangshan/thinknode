/**
 *
 * @author     richen
 * @copyright  Copyright (c) 2015 - <richenlin(at)gmail.com>
 * @license    MIT
 * @version    15/12/3
 */
import base from '../../Core/Base';

export default class extends base {
    init(options = {}) {
        this.options = THINK.extend(false, {
            redis_port: THINK.config('redis_port'),
            redis_host: THINK.config('redis_host'),
            redis_password: THINK.config('redis_password')
        }, options);
        this.handle = null;
        this.deferred = null;
    }

    connect() {
        if (this.handle) {
            return this.deferred.promise;
        }
        let deferred = THINK.getDefer();
        let port = this.options.redis_port || '6379';
        let host = this.options.redis_host || '127.0.0.1';
        let redis = require('redis');
        let connection = redis.createClient(port, host, this.options);
        if (this.options.redis_password) {
            connection.auth(this.options.redis_password, function () {
            });
        }
        if (this.options.redis_db) {
            connection.select(this.options.redis_db, function () {
            });
        }
        connection.on('ready', () => {
            deferred.resolve();
        });
        connection.on('connect', () => {
            deferred.resolve();
        });
        connection.on('error', err => {
            this.close();
            deferred.reject(err);
        });
        connection.on('end', () => {
            this.close();
            deferred.reject('connection end');
        });
        this.handle = connection;
        if (this.deferred) {
            this.deferred.reject(new Error('connection closed'));
        }
        this.deferred = deferred;
        return this.deferred.promise;
    }

    close() {
        if (this.handle) {
            this.handle.quit();
            this.handle = null;
        }
    }

    /**
     *
     * @param name
     * @param data
     */
    async wrap(name, data) {
        let deferred = THINK.getDefer();
        await this.connect().catch(e => deferred.reject(e));
        if (!THINK.isArray(data)) {
            data = data === undefined ? [] : [data];
        }
        data.push((err, data) => {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(data);
            }
        });
        if (this.handle) {
            this.handle[name].apply(this.handle, data);
        } else {
            deferred.reject('connection end');
        }
        return deferred.promise;
    }

    /**
     * 字符串获取
     * @param name
     */
    get(name) {
        return this.wrap('get', [name]);
    }

    /**
     * 字符串写入
     * @param name
     * @param value
     * @param timeout
     * @returns {Promise}
     */
    set(name, value, timeout) {
        let setP = [this.wrap('set', [name, value])];
        if (typeof timeout === 'number') {
            setP.push(this.expire(name, timeout));
        }
        return Promise.all(setP);
    }

    /**
     * 设置key超时属性
     * @param name
     * @param timeout
     */
    expire(name, timeout) {
        return this.wrap('expire', [name, timeout]);
    }

    /**
     * 删除key
     * @param name
     */
    rm(name) {
        return this.wrap('del', [name]);
    }

    /**
     * 批量删除，可模糊匹配
     * @param keyword
     * @returns {*}
     */
    async batchRm(keyword) {
        let keys = await this.wrap('keys', keyword + '*');
        if (THINK.isEmpty(keys)) {
            return null;
        }
        return this.wrap('del', [keys]);
    }

    /**
     * 判断key是否存在
     * @param name
     */
    exists(name) {
        return this.wrap('exists', [name]);
    }

    /**
     * 自增
     * @param name
     */
    incr(name) {
        return this.wrap('incr', [name]);
    }

    /**
     * 自减
     * @param name
     * @returns {*}
     */
    decr(name) {
        return this.wrap('decr', [name]);
    }

    /**
     * 字符key增加指定长度
     * @param name
     * @param incr
     * @returns {*}
     */
    incrBy(name, incr) {
        incr = incr || 1;
        return this.wrap('incrby', [name, incr]);
    }

    /**
     * 哈希写入
     * @param name
     * @param key
     * @param value
     * @param timeout
     */
    hSet(name, key, value, timeout) {
        let setP = [this.wrap('hset', [name, key, value])];
        if (typeof timeout === 'number') {
            setP.push(this.expire(name, timeout));
        }
        return Promise.all(setP);
    }

    /**
     * 哈希获取
     * @param name
     * @param key
     * @returns {*}
     */
    hGet(name, key) {
        return this.wrap('hget', [name, key]);
    }

    /**
     * 查看哈希表 hashKey 中，给定域 key 是否存在
     * @param name
     * @param key
     * @returns {*}
     */
    hExists(name, key) {
        return this.wrap('hexists', [name, key]);
    }

    /**
     * 返回哈希表 key 中域的数量
     * @param name
     * @returns {*}
     */
    hLen(name) {
        return this.wrap('hlen', [name]);
    }

    /**
     * 给哈希表指定key，增加increment
     * @param name
     * @param key
     * @param incr
     * @returns {*}
     */
    hIncrBy(name, key, incr = 1) {
        return this.wrap('hincrby', [name, key, incr]);
    }

    /**
     * 返回哈希表所有key-value
     * @param name
     * @returns {*}
     */
    hGetAll(name) {
        return this.wrap('hgetall', [name]);
    }

    /**
     * 返回哈希表所有key
     * @param name
     * @returns {*}
     */
    hKeys(name) {
        return this.wrap('hkeys', [name]);
    }

    /**
     * 返回哈希表所有value
     * @param name
     * @returns {*}
     */
    hVals(name) {
        return this.wrap('hvals', [name]);
    }

    /**
     * 哈希删除
     * @param name
     * @param key
     * @returns {*}
     */
    hDel(name, key) {
        return this.wrap('hdel', [name, key]);
    }

    /**
     * 判断列表长度，若不存在则表示为空
     * @param name
     * @returns {*}
     */
    lLen(name) {
        return this.wrap('llen', [name]);
    }

    /**
     * 将值插入列表表尾
     * @param name
     * @param value
     * @returns {*}
     */
    rPush(name, value) {
        return this.wrap('rpush', [name, value]);
    }

    /**
     * 将列表表头取出，并去除
     * @param name
     * @returns {*}
     */
    lPop(name) {
        return this.wrap('lpop', [name]);
    }

    /**
     * 集合新增
     * @param name
     * @param value
     * @param timeout
     * @returns {*}
     */
    sAdd(name, value, timeout) {
        let setP = [this.wrap('sadd', [name, value])];
        if (typeof timeout === 'number') {
            setP.push(this.expire(name, timeout));
        }
        return Promise.all(setP);
    }

    /**
     * 返回集合的基数(集合中元素的数量)
     * @param name
     * @returns {*}
     */
    sCard(name) {
        return this.wrap('scard', [name]);
    }

    /**
     * 判断 member 元素是否集合的成员
     * @param name
     * @param key
     * @returns {*}
     */
    sisMember(name, key) {
        return this.wrap('sismember', [name, key]);
    }

    /**
     * 返回集合中的所有成员
     * @param name
     * @returns {*}
     */
    sMembers(name) {
        return this.wrap('smembers', [name]);
    }

    /**
     * 移除并返回集合中的一个随机元素
     * @param name
     * @returns {*}
     */
    sPop(name) {
        return this.wrap('spop', [name]);
    }

    /**
     * 移除集合 key 中的一个 member 元素
     * @param name
     * @param key
     * @returns {*}
     */
    sRem(name, key) {
        return this.wrap('srem', [name, key]);
    }
}
