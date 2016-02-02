/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// set up namespace
if (typeof Mozilla == 'undefined') {
    var Mozilla = {};
}

Mozilla.Firefox = window.Mozilla.Firefox || {};

Mozilla.Firefox.New = (function() {
    'use strict';

    var _client = window.Mozilla.Client;
    var _pathParts = window.location.pathname.split('/');
    var _queryStr = window.location.search ? window.location.search + '&' : '?';
    var _referrer = _pathParts[_pathParts.length - 2];
    var _locale = _pathParts[1];

    return {
        client: _client,
        params: new window._SearchParams(),
        isIELT9: _client.platform === 'windows' && /MSIE\s[1-8]\./.test(navigator.userAgent),
        locale: _locale,
        virtualUrl: ('/' + _locale + '/products/download.html' +
                       _queryStr + 'referrer=' + _referrer)
    };
})();
