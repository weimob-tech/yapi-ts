'use strict';
var tough = require('tough-cookie');
var Store = tough.Store;
var permuteDomain = tough.permuteDomain;
var permutePath = tough.permutePath;

var Event = require('events')

var util = require('util');
// var fs = require('fs');
var Redis = require('ioredis');
var REDIS_CONNECTION_CACHES = {};

function RedisCookieStore(cookieKey, options = {}) {
    Store.call(this);
    this.idx = {}; // idx is memory cache
    this.cookieKey = cookieKey;
    this.event = new Event()
    if(options.redis && options.redis instanceof Redis) {
        this.redis = options.redis
    } else {
        var redisCacheStr = JSON.stringify(options)
        if(!REDIS_CONNECTION_CACHES[redisCacheStr]) {
            REDIS_CONNECTION_CACHES[redisCacheStr] = new Redis(options)
        }
        this.redis = REDIS_CONNECTION_CACHES[redisCacheStr]
        // this.redis.set('fdsf', 'fdsf')
    }
    var self = this;
    loadFromRedis(this.redis, this.cookieKey, function(dataJson) {
        if(dataJson){
            self.idx = dataJson;
            self.inited = true
            self.event.emit('inited')
        }
    })
}
util.inherits(RedisCookieStore, Store);
exports.RedisCookieStore = RedisCookieStore;
RedisCookieStore.prototype.idx = null;
RedisCookieStore.prototype.synchronous = true;
RedisCookieStore.prototype.init = function() {
    var self = this
    if(self.inited) {
        return Promise.resolve(self.inited)
    }
    return new Promise(function(resolve){
        self.event.once('inited', function(){
            resolve.call(self, self.inited)
        })
    })
}

// force a default depth:
RedisCookieStore.prototype.inspect = function() {
    return "{ idx: "+util.inspect(this.idx, false, 2)+' }';
};

RedisCookieStore.prototype.findCookie = function(domain, path, key, cb) {
    if (!this.idx[domain]) {
        return cb(null,undefined);
    }
    if (!this.idx[domain][path]) {
        return cb(null,undefined);
    }
    return cb(null,this.idx[domain][path][key]||null);
};

RedisCookieStore.prototype.findCookies = function(domain, path, cb) {
    var results = [];
    if (!domain) {
        return cb(null,[]);
    }

    var pathMatcher;
    if (!path) {
        // null or '/' means "all paths"
        pathMatcher = function matchAll(domainIndex) {
            for (var curPath in domainIndex) {
                var pathIndex = domainIndex[curPath];
                for (var key in pathIndex) {
                    results.push(pathIndex[key]);
                }
            }
        };

    } else if (path === '/') {
        pathMatcher = function matchSlash(domainIndex) {
            var pathIndex = domainIndex['/'];
            if (!pathIndex) {
                return;
            }
            for (var key in pathIndex) {
                results.push(pathIndex[key]);
            }
        };

    } else {
        var paths = permutePath(path) || [path];
        pathMatcher = function matchRFC(domainIndex) {
            paths.forEach(function(curPath) {
                var pathIndex = domainIndex[curPath];
                if (!pathIndex) {
                    return;
                }
                for (var key in pathIndex) {
                    results.push(pathIndex[key]);
                }
            });
        };
    }

    var domains = permuteDomain(domain) || [domain];
    var idx = this.idx;
    domains.forEach(function(curDomain) {
        var domainIndex = idx[curDomain];
        if (!domainIndex) {
            return;
        }
        pathMatcher(domainIndex);
    });

    cb(null,results);
};

RedisCookieStore.prototype.putCookie = function(cookie, cb) {
    if (!this.idx[cookie.domain]) {
        this.idx[cookie.domain] = {};
    }
    if (!this.idx[cookie.domain][cookie.path]) {
        this.idx[cookie.domain][cookie.path] = {};
    }
    this.idx[cookie.domain][cookie.path][cookie.key] = cookie;
    saveToRedis(this.redis, this.cookieKey, this.idx, function() {
        cb(null);
    });
};

RedisCookieStore.prototype.updateCookie = function updateCookie(oldCookie, newCookie, cb) {
    // updateCookie() may avoid updating cookies that are identical.  For example,
    // lastAccessed may not be important to some stores and an equality
    // comparison could exclude that field.
    this.putCookie(newCookie,cb);
};

RedisCookieStore.prototype.removeCookie = function removeCookie(domain, path, key, cb) {
    if (this.idx[domain] && this.idx[domain][path] && this.idx[domain][path][key]) {
        delete this.idx[domain][path][key];
    }
    saveToRedis(this.redis, this.cookieKey, this.idx, function() {
        cb(null);
    });
};

RedisCookieStore.prototype.removeCookies = function removeCookies(domain, path, cb) {
    if (this.idx[domain]) {
        if (path) {
            delete this.idx[domain][path];
        } else {
            delete this.idx[domain];
        }
    }
    saveToRedis(this.redis, this.cookieKey, this.idx, function() {
        return cb(null);
    });
};

function saveToRedis(redis, cookieKey, data, cb) {
    var dataJson = JSON.stringify(data);
    // this.redis
    redis.set(cookieKey, dataJson).then(r => {
        if(r === 'OK') {
           cb()
        } else {
            throw r
        }
    })
    // fs.writeFile(cookieKey, dataJson, function (err) {
        // if (err) throw err;
        // cb();
    // });
}

function loadFromRedis(redis, cookieKey, cb) {
    redis.get(cookieKey).then(data => {
        var dataJson = data ? JSON.parse(data) : null;
        for (var domainName in dataJson) {
            for (var pathName in dataJson[domainName]) {
                for (var cookieName in dataJson[domainName][pathName]) {
                    dataJson[domainName][pathName][cookieName] = tough.fromJSON(JSON.stringify(dataJson[domainName][pathName][cookieName]));
                }
            }
        }
        cb(dataJson);
    })
}
