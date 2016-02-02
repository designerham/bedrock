/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

;(function(Mozilla, w, $) {
    'use strict';

    var client = Mozilla.Client;
    var $wrapper = $('#wrapper');

    if (client.isFirefox) {
        if (client.isFirefoxDesktop) {
            // The new Firefox Hello is available to Firefox 45 users and upward.
            if (client.FirefoxMajorVersion >= 45) {
                $wrapper.addClass('firefox-up-to-date');
            } else {
                $wrapper.addClass('firefox-out-of-date');
            }
        } else {
            $wrapper.addClass('mobile');
        }
    } else {
        $wrapper.addClass('non-firefox');
    }

})(window.Mozilla, window, window.jQuery);
