# Redis Cookie Store

tough-cookie-redisstore is a File store for tough-cookie module, base on [tough-cookie-filestore](https://github.com/mitsuru/tough-cookie-filestore). See
[tough-cookie documentation](https://github.com/goinstant/tough-cookie#constructionstore--new-memorycookiestore-rejectpublicsuffixes) for more info.


## installation

    $ npm install tough-cookie-redisstore

## Options

  `path` file path of cookiejar.

## Usage

  var RedisCookieStore = require("tough-cookie-redisstore");
  var CookieJar = require("tough-cookie").CookieJar;

  var jar = new CookieJar(new RedisCookieStore("username-cookie-key"));

## License

 MIT
