/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// set up namespace
if (typeof Mozilla == 'undefined') {
    var Mozilla = {};
}

Mozilla.Firefox = window.Mozilla.Firefox || {};

;(function($, dataLaye, MFNew) {
    'use strict';

    var $html = $(document.documentElement);
    var $document = $(document);
    var scene2URL = '/' + MFNew.locale + '/firefox/new/?scene=2&v=2&dlstarted=1';
    var state; // track page state

    var uiTourSendEvent = function(action, data) {
        var event = new CustomEvent('mozUITour', {
            bubbles: true,
            detail: {
                action: action,
                data: data || {}
            }
        });

        document.dispatchEvent(event);
    };

    if (MFNew.client.isFirefoxDesktop || MFNew.client.isFirefoxAndroid) {
        // Detect whether the Firefox is up-to-date in a non-strict way. The minor version and channel are not
        // considered. This can/should be strict, once the UX especially for ESR users is decided. (Bug 939470)
        if (MFNew.client._isFirefoxUpToDate(false)) {
            // the firefox-latest class prevents the download from triggering
            // and scene 2 from showing, which we want if the user lands on
            // /firefox/new/ but if the user visits /firefox/new/?scene=2#download-fx
            // (from a download button) then we want them to see the same scene 2
            // as non-firefox users and initiate a download
            $html.addClass('firefox-latest');

            // if user is on desktop release channel and has latest version, offer refresh button
            if (MFNew.client.isFirefoxDesktop) {
                MFNew.client.getFirefoxDetails(function(data) {
                    if (data.channel === 'release' && data.isUpToDate) {
                        $html.addClass('show-refresh');

                        // DOM may not be ready yet, so bind filtered click handler to document
                        $document.on('click', '#refresh-firefox', function() {
                            uiTourSendEvent('resetFirefox');
                        });
                    }
                });
            }
        } else {
            $html.addClass('firefox-old');
        }
    }

    // Add GA custom tracking and external link tracking
    state = 'Desktop, not Firefox';

    if (MFNew.client.platform === 'android') {
        if ($html.hasClass('firefox-latest')) {
            state = 'Android, Firefox up-to-date';
        } else if ($html.hasClass('firefox-old')) {
            state = 'Android, Firefox not up-to-date';
        } else {
            state = 'Android, not Firefox';
        }
    } else if (MFNew.client.platform === 'ios') {
        state = 'iOS';
    } else if (MFNew.client.platform === 'fxos') {
        state = 'FxOS';
    } else {
        if ($html.hasClass('firefox-latest')) {
            state = 'Desktop, Firefox up-to-date';
        } else if ($html.hasClass('firefox-old')) {
            state = 'Desktop, Firefox not up-to-date';
        }
    }

    //GA Custom Dimension in Pageview
    window.dataLayer.push({
        'event': 'set-state',
        'state': state
    });

    $document.ready(function() {
        // primary download button has force_direct = True, so download will
        // begin immediately (popup for IE < 9 - see global.js). Give user half
        // second wait, then track and redirect to scene 2 page.
        $('#primary-download-button .download-link').on('click', function(e) {
            window.setTimeout(function() {
                window.dataLayer.push({
                    'event': 'virtual-pageview',
                    'virtualUrl': MFNew.virtualUrl
                });

                window.location.href = scene2URL;
            }, 500);
        });

        // if android, update text on dl button
        if (MFNew.client.platform === 'android') {
            $('#download-button-mobile .download-subtitle').html(
                $('#download-button-wrapper-mobile').data('upgradeSubtitle'));

            return;
        }

        // if desktop download available, re-locate dl button links
        if ($('#download-button-wrapper-desktop').is(':visible')) {
            var $downloadButtonLinks = $('#download-button-wrapper-desktop .download-other-desktop').detach();
            $downloadButtonLinks.css('display', 'block').appendTo('#download-buttons');
        }
    });
})(window.jQuery, window.dataLayer = window.dataLayer || [], window.Mozilla.Firefox.New);
