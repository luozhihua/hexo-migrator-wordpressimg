var async = require('async'),
    path = require('path'),
    mkdirp = require('mkdirp'),
    http = require('http'),
    fs = require('fs');

/**
 * 补全域名
 * @param  {String} host 域名
 * @return {String}        补全后的域名
 */
function completeHost(host) {

    if (!/^https?:\/\//.test(host)) {
        host = 'http://' + host;
    }

    host += '/wp-content/uploads/';

    return host;
}

/**
 * 匹配文字内容所包含的图片地址
 * @param  {String} content 文章内容
 * @param  {String} host  域名
 * @return {Array}          匹配到的图片地址
 */
function matchImgs(content, host) {
    var uniqueImgs = {};
    var exts = 'jpg|jpeg|png|gif|webp';
    var reg = new RegExp(host + '[^('+ exts +')]*\.('+ exts +')', 'g');

    return content.match(reg) || [];
}

/**
 * [getClearDir description]
 * @param  {[type]} title [description]
 * @return {[type]}       [description]
 */
function getClearDir(title) {
    return title.replace(/[&\/\\/\:\?\.]/g, '');
}

/**
 * 下载图片
 * @param  {[type]} url [description]
 * @return {[type]}     [description]
 */
function downloadImg(url, data, next) {

    var pathname = 'imgs/' + getClearDir(data.title);
    var filename = url.match(/[^/]+\.\w+$/);
    var dir = path.join(__dirname, '../../source/', pathname);

    filename = filename ? filename.toString() : '';

    async.waterfall([
        function(callback) {
            if (!fs.existsSync(dir)) {
                mkdirp(dir, function(err) {
                    callback();
                });
            } else {
                callback();
            }
        },

        function() {

            var filepath = path.join(dir, filename);

            if (fs.existsSync(filepath)) {
                console.log('file exists: ' + filepath);
                data.content = data.content.replace(url, path.join(pathname, filename));
                next(null);
            } else {
                http.get(url, function(res) {

                    var imgData = "";

                    res.setEncoding("binary"); //一定要设置response的编码为binary否则会下载下来的图片打不开
                    res.on("data", function(chunk){
                        imgData += chunk;
                    });

                    res.on("end", function() {

                        fs.writeFile(filepath, imgData, "binary", function(err){
                            if(err){
                                console.log("download fail: "+ url);
                            } else {
                                data.content = data.content.replace(url, path.join(pathname, filename));
                                console.log("download success: "+ url);
                            }

                            next(err);
                        });
                    });
                });
            }
        }
    ]);
}

module.exports = function(data, host, callback) {
    host = completeHost(host);
    var list = matchImgs(data.content, host);
    var queue = [];

    list.forEach(function (url) {
        queue.push(function(next) {
            downloadImg(url, data, next);
        });
    });

    async.parallel(queue, function(err, results) {
        callback(data);
    });

    return data;
}

