#!/usr/bin/env node

/**
 * @author Korkeat W. <korkeat.wannapat@gmail.com>
 * @description Simple version of log analytics
 */

'use strict';

var Config = require('./config/config'),
    LogAnalytics = require('./lib/log-analytics');

var analytics = new LogAnalytics(Config),
    logLines = analytics.readLog(),
    urlsPattern = Config.monitoringUrls.map(function (entry) {
        return entry.urlPattern;
    }),
    urlsMatcher = new RegExp(urlsPattern.join('|'));

logLines.forEach(function (logLine) {
    // filter out unwanted log
    if (!logLine.match(urlsMatcher)) {
        return;
    }
    analytics.process(logLine);
});

analytics.printSummary();
