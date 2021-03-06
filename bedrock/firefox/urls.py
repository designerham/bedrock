# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
from django.conf.urls import url

from bedrock.redirects.util import redirect
from bedrock.mozorg.util import page

import views
import bedrock.releasenotes.views
from bedrock.releasenotes import version_re


latest_re = r'^firefox(?:/(?P<version>%s))?/%s/$'
firstrun_re = latest_re % (version_re, 'firstrun')
firstrun_learnmore_re = latest_re % (version_re, 'firstrun/learnmore')
whatsnew_re = latest_re % (version_re, 'whatsnew')
tour_re = latest_re % (version_re, 'tour')
hello_start_re = latest_re % (version_re, 'hello/start')
tracking_protection_re = latest_re % (version_re, 'tracking-protection/start')
platform_re = '(?P<platform>android|ios)'
channel_re = '(?P<channel>beta|aurora|developer|organizations)'
releasenotes_re = latest_re % (version_re, r'(aurora|release)notes')
android_releasenotes_re = releasenotes_re.replace('firefox', 'firefox/android')
ios_releasenotes_re = releasenotes_re.replace('firefox', 'firefox/ios')
sysreq_re = latest_re % (version_re, 'system-requirements')
ios_sysreq_re = sysreq_re.replace('firefox', 'firefox/ios')


urlpatterns = (
    redirect(r'^firefox/$', 'firefox.new', name='firefox', locale_prefix=False),
    url(r'^firefox/(?:%s/)?(?:%s/)?all/$' % (platform_re, channel_re),
        views.all_downloads, name='firefox.all'),
    page('firefox/accounts', 'firefox/accounts.html'),
    page('firefox/channel', 'firefox/channel.html'),
    redirect('^firefox/channel/android/$', 'firefox.channel', locale_prefix=False),
    url(r'^firefox/choose/$', views.choose, name='firefox.choose'),
    page('firefox/desktop', 'firefox/desktop/index.html'),
    page('firefox/desktop/fast', 'firefox/desktop/fast.html'),
    page('firefox/desktop/customize', 'firefox/desktop/customize.html'),
    page('firefox/desktop/tips', 'firefox/desktop/tips.html'),
    page('firefox/desktop/trust', 'firefox/desktop/trust.html'),
    page('firefox/developer', 'firefox/developer.html'),
    page('firefox/geolocation', 'firefox/geolocation.html'),
    url(r'^firefox/hello/$', views.hello, name='firefox.hello'),
    page('firefox/interest-dashboard', 'firefox/interest-dashboard.html'),
    page('firefox/android', 'firefox/android/index.html'),
    page('firefox/android/faq', 'firefox/android/faq.html'),
    page('firefox/ios', 'firefox/ios.html'),
    page('firefox/mobile-download', 'firefox/mobile-download.html'),
    page('firefox/os/faq', 'firefox/os/faq.html'),
    page('firefox/products', 'firefox/family/index.html'),
    page('firefox/private-browsing', 'firefox/private-browsing.html'),
    url('^firefox/send-to-device-post/$', views.send_to_device_ajax,
        name='firefox.send-to-device-post'),
    page('firefox/sync', 'firefox/sync.html'),
    page('firefox/tiles', 'firefox/tiles.html'),
    page('firefox/unsupported-systems', 'firefox/unsupported-systems.html'),
    url(r'^firefox/new/$', views.new, name='firefox.new'),
    page('firefox/organizations/faq', 'firefox/organizations/faq.html'),
    page('firefox/organizations', 'firefox/organizations/organizations.html'),
    page('firefox/nightly/firstrun', 'firefox/nightly_firstrun.html'),
    url(r'^firefox/installer-help/$', views.installer_help,
        name='firefox.installer-help'),

    page('firefox/unsupported/warning', 'firefox/unsupported/warning.html'),
    page('firefox/unsupported/EOL', 'firefox/unsupported/EOL.html'),
    page('firefox/unsupported/mac', 'firefox/unsupported/mac.html'),
    page('firefox/unsupported/details', 'firefox/unsupported/details.html'),

    # bug 960651
    # here because it needs to come after the above rule
    redirect(r'(firefox|mobile)/([^/]+)/details(/|/.+\.html)?$', 'firefox.unsupported.details',
             locale_prefix=False),

    url(r'^firefox/unsupported/win/$', views.windows_billboards),
    url('^firefox/dnt/$', views.dnt, name='firefox.dnt'),
    url(firstrun_re, views.FirstrunView.as_view(), name='firefox.firstrun'),
    url(firstrun_learnmore_re, views.FirstrunLearnMoreView.as_view(),
        name='firefox.firstrun.learnmore'),
    url(whatsnew_re, views.WhatsnewView.as_view(), name='firefox.whatsnew'),
    url(tour_re, views.TourView.as_view(), name='firefox.tour'),
    url(hello_start_re, views.HelloStartView.as_view(), name='firefox.hello.start'),

    url(tracking_protection_re, views.TrackingProtectionTourView.as_view(),
        name='firefox.tracking-protection-tour.start'),

    # This dummy page definition makes it possible to link to /firefox/ (Bug 878068)
    url('^firefox/$', views.fx_home_redirect, name='firefox'),

    url('^firefox/os/$', views.firefox_os_geo_redirect, name='firefox.os.index'),
    page('firefox/os/2.5', 'firefox/os/ver/2.5.html'),
    page('firefox/os/2.0', 'firefox/os/ver/2.0.html'),
    page('firefox/os/1.4', 'firefox/os/ver/1.4.html'),
    page('firefox/os/1.3t', 'firefox/os/ver/1.3T.html'),
    page('firefox/os/1.3', 'firefox/os/ver/1.3.html'),
    page('firefox/os/1.1', 'firefox/os/ver/1.1.html'),

    page('mwc', 'firefox/os/mwc-2015-preview.html'),

    page('firefox/os/devices', 'firefox/os/devices.html'),
    page('firefox/os/devices/tv', 'firefox/os/tv.html'),

    page('firefox/pocket', 'firefox/pocket.html'),

    url(r'^firefox/windows-10/welcome/$', views.Win10Welcome.as_view(), name='firefox.win10-welcome'),

    # Release notes
    url('^firefox/(?:%s/)?(?:%s/)?notes/$' % (platform_re, channel_re),
        bedrock.releasenotes.views.latest_notes, name='firefox.notes'),
    url('firefox/(?:latest/)?releasenotes/$', bedrock.releasenotes.views.latest_notes,
        {'product': 'firefox'}),
    url('^firefox/(?:%s/)?system-requirements/$' % channel_re,
        bedrock.releasenotes.views.latest_sysreq,
        {'product': 'firefox'}, name='firefox.sysreq'),
    url(releasenotes_re, bedrock.releasenotes.views.release_notes, name='firefox.desktop.releasenotes'),
    url(android_releasenotes_re, bedrock.releasenotes.views.release_notes,
        {'product': 'Firefox for Android'}, name='firefox.android.releasenotes'),
    url(ios_releasenotes_re, bedrock.releasenotes.views.release_notes,
        {'product': 'Firefox for iOS'}, name='firefox.ios.releasenotes'),
    url(sysreq_re, bedrock.releasenotes.views.system_requirements,
        name='firefox.system_requirements'),
    url(ios_sysreq_re, bedrock.releasenotes.views.system_requirements,
        {'product': 'Firefox for iOS'}, name='firefox.ios.system_requirements'),
    url('^firefox/releases/$', bedrock.releasenotes.views.releases_index,
        {'product': 'Firefox'}, name='firefox.releases.index'),

    # Bug 1108828. Different templates for different URL params.
    url('firefox/feedback', views.FeedbackView.as_view(), name='firefox.feedback'),

)
