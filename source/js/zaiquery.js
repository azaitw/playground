/* jshint strict:true, unused: false */
/* global document, XMLHttpRequest, window */

'use strict';

/* 財Query */
var zaiquery = {
    _attrs: {
        doms: {}
    },
    // Create app: Create app container, copy methods, parse templates
    createApp: function (app, appId) {
        var newObj = app;
        var key;
        for (key in this) { // Return an object with methods combined from custom and Yup's
            if (this.hasOwnProperty(key)) {
                if (!newObj.hasOwnProperty(key)) {
                    newObj[key] = this[key];
                }
            }
        }
        // get app/module's element and save it in attrs
        newObj._attrs.doms.app = document.getElementById(appId) || {};
        // Execute everything in app's load method
        newObj.load();
        return newObj;
    },
    // Fetch data
    fetch: function (url, callback) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                callback(JSON.parse(xmlhttp.responseText));
            }
        };
        xmlhttp.open('GET', url, true);
        xmlhttp.send();
    },
    // More efficient DOM manipulation
    dom: function (fn) {
        if (window.requestAnimationFrame) {
            window.requestAnimationFrame(fn);
        } else {
            fn();
        }
    },
    query: function (queryString) {
        return this._attrs.doms.app.querySelectorAll(queryString) || [{}];
    }
};