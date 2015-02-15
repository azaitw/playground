/* jshint strict:true */

'use strict';

var express = require('express');
var app = express();

var processdata = function (callback) {
    var fs = require('fs');
    var path = require('path');
    var rawFilePath = path.join(__dirname, 'data/raw/timezone.json');
    var writeFilePath = path.join(__dirname, 'data/timezone.json');
    var result = {};
    var key;

    var rawProcessor = function (rawData) {
        var i;
        var data = rawData.slice(0);
        var dataLen = data.length;
        var keygroup;
        var placeholder = '';
        for (i = 0; i < dataLen; i += 1) {
            keygroup = data[i].city.charAt(0).toLowerCase();
            if (typeof result[keygroup] === 'undefined') {
                result[keygroup] = [];
            }
            placeholder = data[i].city.toLowerCase();
            placeholder.replace('_', ' ');
            result[keygroup].push(placeholder);
        }
        return result;
    };

    fs.readFile(rawFilePath, {encoding: 'utf-8'}, function (err, rawData) {
        var data = JSON.parse(rawData);
        for (key in data) {
            if (data.hasOwnProperty(key)) {
                rawProcessor(data[key]);
            }
        }
        result = JSON.stringify(result);
        fs.writeFile(writeFilePath, result, function (err) {
            if (err) {
                callback('error: ' + err);
            }
            callback('file created: ' + writeFilePath);
        });
    });
};
app.get('/', function(req, res){
    res.send('hi');
});
app.get('/processdata', function(req, res){
    processdata(function (D) {
        res.send(D);
    });
});
app.listen(3000);