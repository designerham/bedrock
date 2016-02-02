/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// set up namespace
if (typeof Mozilla == 'undefined') {
    var Mozilla = {};
}

Mozilla.Firefox = window.Mozilla.Firefox || {};

;(function($, dataLayer, MFNew) {
    'use strict';

    var $directDownloadLink = $('#direct-download-link');
    var $stage = $('#stage');
    var downloadStarted = Number(MFNew.params.get('dlstarted')) === 1;

    //$(document).ready(function() {
        // pixel remains in perpetuity (https://bugzilla.mozilla.org/show_bug.cgi?id=1222945#c2)
        if (!window._dntEnabled()){
            var $body = $('body');

            var $pixel = $('<img />', {
                width: '1',
                height: '1',
                src: 'https://servedby.flashtalking.com/spot/8/6247;40428;4669/?spotName=Mozilla_Download_Conversion'
            });

            $body.append($pixel);
        }

        // Pull download link from the download button and add to the
        // 'click here' link.
        // TODO: Remove and generate link in bedrock.
        $directDownloadLink.attr(
            'href', $('#download-button-wrapper-desktop .download-list li:visible .download-link').attr('href')
        );

        // #direct-download-link = "click here" text on page
        // .download-link = any links in download button (which are effectively
        // hidden, but could be clicked by screen reader?)
        $stage.on('click', '#direct-download-link, .download-link', function(e) {
            e.preventDefault();

            var url = $(e.currentTarget).attr('href');

            // An iframe cannot be used here to trigger the download because
            // it will be blocked by Chrome if the download link redirects
            // to a HTTP URI and we are on HTTPS.
            function trackAndRedirect(url, virtualUrl) {
                window.dataLayer.push({
                    'event': 'virtual-pageview',
                    'virtualUrl': virtualUrl
                });

                window.location.href = url;
            }

            trackAndRedirect(url, MFNew.virtualUrl);
        });

        // if user did not come from scene 1 and is not on an IE that blocks
        // JS triggered downloads, start the platform-detected download
        // after window (read: images) have loaded
        if (!downloadStarted && !MFNew.isIELT9) {
            $(window).on('load', function() {
                $directDownloadLink.trigger('click');
            });
        }
    //});
})(window.jQuery, window.dataLayer = window.dataLayer || [], window.Mozilla.Firefox.New);
