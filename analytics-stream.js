#!/usr/bin/env node

/**
 * @author Korkeat W. <korkeat.wannapat@gmail.com>
 * @description Streaming version of log analytics designed to solve memory
 *              issue when due with very big file.
 */

'use strict';

var Config = require('./config/config'),
    LogAnalytics = require('./lib/log-analytics');

var analytics = new LogAnalytics(Config),
    logStream = analytics.readLogStream(),
    urlsPattern = Config.monitoringUrls.map(function (entry) {
        return entry.urlPattern;
    }),
    urlsMatcher = new RegExp(urlsPattern.join('|'));

logStream.on('line', function (logLine) {
    // filter out unwanted log
    if (!logLine.match(urlsMatcher)) {
        return;
    }
    analytics.process(logLine);
});

logStream.on('close', function () {
    analytics.printSummary();
});
