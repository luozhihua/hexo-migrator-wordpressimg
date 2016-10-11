var path = require('path'),
    moment = require('moment'),
    hexoUtil = require('hexo-util'),
    fs = require('fs');


module.exports = function(data) {
    data = data || {};

    data.title = hexoUtil.slugize((data.title || data.slug).toString(), 0);

    if (data.date) {
        var date = moment(data.date);
        data.year = date.year();
        data.month = date.month() + 1;
        data.idate = date.date();
        data.day = date.day();
    }

    return data;
}

