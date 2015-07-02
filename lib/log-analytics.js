/**
 * @author Korkeat W. <korkeat.wannapat@gmail.com>
 */

'use strict';

var Fs = require('fs'),
    Readline = require('readline'),
    Helper = require('./helper');

var LogAnalytics = function (config) {
    this.config = config || {};

    if (Object.getOwnPropertyNames(this.config).length === 0) {
        throw new Error('config can not be empty');
    }

    this.urlNames = config.monitoringUrls.map(function (entry) {
        return entry.name;
    });
    this.urlsPattern = config.monitoringUrls.map(function (entry) {
        return entry.urlPattern;
    });
    this.urlsRegExp = config.monitoringUrls.map(function (entry) {
        return entry.urlRegExp;
    });
    this.summary = {};
    this.initSummary();

    return this;
};

LogAnalytics.prototype.readLog = function () {
    var logLines = Fs.readFileSync(this.config.targetLogPath, {encoding: 'utf-8'})
            .split('\n')
            .filter(function (line) {
                line = line.trim();

                if (line !== '') {
                    return line;
                }
            }),
        linesLen = logLines.length;

    return logLines;
};

LogAnalytics.prototype.readLogStream = function () {
    return Readline.createInterface({
        input: Fs.createReadStream(this.config.targetLogPath)
    });
};

LogAnalytics.prototype.parseLogLine = function (logLine) {
    var parsedObj = {},
        splited = logLine.split(' '),
        keyPairRegex = new RegExp(/^([\w\d]+)=([\W\w]+)$/),
        filtered = splited.filter(function (logElm) {
            // the element that doesn't match key=val pattern was filtered
            if (logElm.match(keyPairRegex)) {
                return logElm;
            }
        });

    filtered.map(function (logElm) {
        var elmSplited = logElm.split('='),
            key = elmSplited[0],
            val = elmSplited[1];
        parsedObj[key] = Helper.normQuotes(val);
    });

    return parsedObj;
};

LogAnalytics.prototype.initSummary = function () {
    var curEntry,
        idx;

    for (idx in this.config.monitoringUrls) {
        if (this.config.monitoringUrls.hasOwnProperty(idx)) {
            curEntry = this.config.monitoringUrls[idx];
            if (this.summary[curEntry.name] === undefined) {
                this.summary[curEntry.name] = {};
                this.summary[curEntry.name].analyticsUrl = curEntry.path;
                this.summary[curEntry.name].dynos = {};
                this.summary[curEntry.name].respTimeList = [];
                this.summary[curEntry.name].reqNumber = 0;
            }
        }
    }
};

LogAnalytics.prototype.process = function (logLine) {
    var logParsed = this.parseLogLine(logLine),
        dyno = logParsed.dyno,
        connectTime = Helper.normTime(logParsed.connect),
        serviceTime = Helper.normTime(logParsed.service),
        respTime = connectTime + serviceTime,
        curEntry,
        idx;

    for (idx in this.config.monitoringUrls) {
        if (this.config.monitoringUrls.hasOwnProperty(idx)) {
            curEntry = this.config.monitoringUrls[idx];
            if (logLine.match(curEntry.urlRegExp)) {
                break;
            }
        }
    }

    if (this.summary[curEntry.name].dynos[dyno] === undefined) {
        this.summary[curEntry.name].dynos[dyno] = 0;
    }

    this.summary[curEntry.name].dynos[dyno] += 1;
    this.summary[curEntry.name].reqNumber += 1;
    this.summary[curEntry.name].respTimeList.push(respTime);
};

LogAnalytics.prototype.printSummary = function () {
    var self = this,
        summary = this.summary,
        sumKeys = Object.keys(this.summary),
        entry,
        sortedRespTime,
        mean,
        median,
        mode,
        mostCalledDyno;

    sumKeys.forEach(function (key) {
        entry = summary[key];
        sortedRespTime = Helper.sortNumList(entry.respTimeList);
        mostCalledDyno = Helper.mostCalledDyno(entry.dynos);
        mean = Helper.mean(sortedRespTime);
        median = Helper.median(sortedRespTime);
        mode = Helper.mode(sortedRespTime);
        mode = (typeof mode === 'number') ? mode + 'ms' : mode;

        if (typeof mean === 'number') {
            mean = (mean % 1 === 0) ? mean + 'ms' : mean.toFixed(2) + 'ms';
        }

        if (typeof median === 'number') {
            median = (median % 1 === 0) ? median + 'ms' : median.toFixed(2) + 'ms';
        }

        console.log(
            self.config.resultTemplate,
            entry.analyticsUrl,
            entry.reqNumber,
            mean,
            median,
            mode,
            mostCalledDyno
        );
    });
};

module.exports = function createLogAnalytics(config) {
    return new LogAnalytics(config);
};
