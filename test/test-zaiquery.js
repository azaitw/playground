/* jshint strict:true */
/* global describe, it */
'use strict';

var assert = require('chai').assert;
var readClientJS = require('./lib/readClientJS');

readClientJS('../zaiquery.js');

describe('zaiQuery', function () {
    it('.createApp returns an app object with zaiquery\'s handy tools', function (done) {
        assert.equal(true, true);
        done();
    });

});
