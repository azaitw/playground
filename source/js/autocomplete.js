/* jshint strict:true */
/* global zaiquery, escape */

'use strict';

var autoComplete = zaiquery.createApp({
    attrs: {
        data: {},
        queryItems: [],
        dom: {}
    },
    templates: function (template, inputString) {
        switch (template) {
        case 'suggestionItem':
            return '<li class="Lh-4 M-5"><button class="sug-item Bdr-r5 Bdr-3 Bgc-1">' + inputString + '</button></li>';
        case 'queryItem':
            return '<li class="search-query D-ib P-3 Pl-5 Bgc-1 Bdr-r3 Bdr-4 Mr-3 Lh-2 anim-pop" data-query="' + inputString + '">' + inputString + '<button class="btn-x Ml-5 Bgc-0 Bdr-0 C-1" data-query="' + inputString + '">x</button></li>';
        default:
            return '';
        }
    },
    getSuggestions: function (input) {
        var inputLen = input.length || 0;
        var alphabetGroup = autoComplete.attrs.data.tzdata[input.charAt(0)] || [];
        var alphabetGroupLen = alphabetGroup.length || 0;
        var i;
        var flagWhenFound = 0;
        var placeholder;
        var result = [];
        var queries = this.attrs.queryItems;
        var queriesLen = queries.length;

        // Get matched results from data
        for (i = 0; i < alphabetGroupLen; i += 1) {
            placeholder = alphabetGroup[i];
            if (placeholder.substr(0, inputLen).toLowerCase() === input) {
                flagWhenFound = 1;
                result.push(placeholder);
            } else if (flagWhenFound) {
                break;
            }
        }
        // Remove keywords that are already in query
        for (i = 0; i < queriesLen; i += 1) {
            result = this.returnArrayWithoutItem(queries[i], result);
        }
        return result;
    },
    generateSuggestionsHtml: function (input) {
        var that = autoComplete;
        var suggestions = that.getSuggestions(input);
        var suggestionsLen = suggestions.length;
        var suggestionsContainer = that.query('.suggestions')[0];
        var i;
        var dataInHtml = '';

        for (i = 0; i < suggestionsLen; i += 1) {
            dataInHtml += that.templates('suggestionItem', suggestions[i]);
        }
        that.dom(function () {
            suggestionsContainer.innerHTML = dataInHtml;
            that.bindSuggestionItemEvent();
        });
    },
    appendQueryItemHtml: function (queryString) {
        var that = this;
        that.dom(function () {
            var container = that.query('.queries')[0];
            var newItem;
            container.innerHTML += that.templates('queryItem', queryString);
            newItem = that.query('.search-query:last-child')[0];
            setTimeout(function () {
                newItem.className = newItem.className.substring(0, newItem.className.indexOf('anim-pop'));
            }, 200);
            that.bindRemoveQueryEvent(newItem);
            that.setSuggestionBoxPos();
            that.submitQuery();
        });
    },
    addQueryItem: function (queryString) {
        var that = autoComplete;
        var input = that.attrs.dom.input;
        if (that.attrs.queryItems.indexOf(queryString) === -1) {
            that.attrs.queryItems.push(queryString);
            that.appendQueryItemHtml(queryString);
            input.focus();
        } else {
            //duplicate
            //anim-pop
        }
        //clear input and suggestions
        that.dom(function () {
            input.value = '';
            that.updateInputWidth('');
            that.query('.suggestions')[0].innerText = '';
        });
        // modify input and add query item
    },
    returnArrayWithoutItem: function (item, array) {
        var key = array.indexOf(item);
        var result = array.slice(0);
        if (key !== -1) {
            result.splice(key, 1);
        }
        return result;
    },
    bindRemoveQueryEvent: function () {
        var that = autoComplete;
        var closeBtns = that.query('.search-query .btn-x');
        var closeBtnsLen = closeBtns.length;
        var i;
        var bindEvent = function (node) {
            node.addEventListener('click', function (e) {
                var queryItemToRemove = e.target.dataset.query;
                that.attrs.queryItems = that.returnArrayWithoutItem(queryItemToRemove, that.attrs.queryItems);
                this.parentNode.remove();
                that.setSuggestionBoxPos();
                that.submitQuery();
            });
        };
        for (i = 0; i < closeBtnsLen; i += 1) {
            bindEvent(closeBtns[i]);
        }
    },
    bindSuggestionItemEvent: function () {
        var that = autoComplete;
        that.dom(function () {
            var items = that.query('.sug-item');
            var itemsLen = items.length;
            var i;
            var bindEvent = function (node) {
                node.addEventListener('click', function () {
                    that.addQueryItem(this.innerText);
                });
            };
            for (i = 0; i < itemsLen; i += 1) {
                bindEvent(items[i]);
            }
        });
    },
    updateInputWidth: function (input) {
        var that = autoComplete;
        var inputLen = input.length;
        var width = Math.max(50, inputLen * 10);
        that.attrs.dom.input.style.width = width + 'px';
    },
    bindAutoCompleteEvent: function (inputField) {
        var that = this;
        inputField.addEventListener('keyup', function (e) {
            var input = e.target.value.trim();
            if (e.keyCode == 13) { // submit
                if (that.attrs.queryItems.length !== 0 || input !== '') {
                    if (input !== '') {
                        that.addQueryItem(input);
                    }
                    that.submitQuery();
                }
            } else {
                if (input !== '') {
                    that.generateSuggestionsHtml(input);
                    that.updateInputWidth(input);
                    that.query('.query-string')[0].innerText = '';
                } else {
                    that.query('.suggestions')[0].innerText = '';
                }
            }
        });
    },
    setSuggestionBoxPos: function () {
        var that = autoComplete;
        var input = that.attrs.dom.input;
        var leftPos = input.offsetLeft;
        var suggestionBox = that.query('.suggestions')[0];
        suggestionBox.style.left = leftPos - 5 + 'px';
    },
    submitQuery: function () {
        var that = autoComplete;
        var queryArray = that.attrs.queryItems;
        var firstQuery = queryArray[0] || '';
        var queryArrayLen = queryArray.length;
        var i;
        var queryString = '/search?q=' + escape(firstQuery);
        var queryStringHtml = that.query('.query-string')[0];
        for (i = 1; i < queryArrayLen; i += 1) {
            queryString += '&' + escape(queryArray[i]);
        }
        queryStringHtml.innerText = queryString;
    },
    cacheDom: function () {
        this.attrs.dom.input = this.query('.ac-input')[0];
    },
    load: function () {
        var that = this;
        that.fetch('./data/timezone.json', function (result) {
            that.attrs.data.tzdata = result;
        });
        that.cacheDom();
        that.query('.search-wrap')[0].addEventListener('click', function () {
            that.attrs.dom.input.focus();
        });
        that.bindAutoCompleteEvent(that.attrs.dom.input);
    }
}, 'search');