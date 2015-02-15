/* jshint strict:true, unused: false */

'use strict';

var fs = require('fs');
var path = require('path');

var readClientJS = function (filePath) {
    fs.readFile(path.join(__dirname, '../' + filePath), {encoding: 'utf-8'}, function (err, rawData) {
        module.export = rawData;
    });
};
