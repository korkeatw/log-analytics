/**
 * @author Korkeat W. <korkeat.wannapat@gmail.com>
 */

'use strict';

var Fs          =   require('fs'),
    Readline    =   require('readline'),
    Chalk       =   require('chalk'),
    Helper      =   require('./helper');

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
                if (line.trim() !== '') {
                    return line;
                }
            });

    return logLines;
};

LogAnalytics.prototype.readLogStream = function () {
    return Readline.createInterface({
        input: Fs.createReadStream(this.config.targetLogPath)
    });
};

LogAnalytics.prototype.parseLogLine = function (logLine) {
    var parsedObj = {};

    logLine.split(' ').filter(function (logElm) {
        // the element that doesn't match key=val pattern was filtered
        if (logElm.indexOf('=') !== -1) {
            return logElm;
        }
    }).map(function (logElm) {
        var elmSplited = logElm.split('='),
            key = elmSplited[0],
            val = elmSplited[1];
        parsedObj[key] = Helper.normQuotes(val);
    });

    return parsedObj;
};

LogAnalytics.prototype.initSummary = function () {
    var self = this;
    this.config.monitoringUrls.forEach(function (curEntry) {
        if (self.summary[curEntry.name] === undefined) {
            self.summary[curEntry.name] = {};
            self.summary[curEntry.name].analyticsUrl = curEntry.path;
            self.summary[curEntry.name].dynos = {};
            self.summary[curEntry.name].respTimeList = [];
            self.summary[curEntry.name].reqNumber = 0;
        }
    });
};

LogAnalytics.prototype.process = function (logLine) {
    var monitoringUrls = this.config.monitoringUrls,
        logParsed = this.parseLogLine(logLine),
        dyno = logParsed.dyno,
        connectTime = Helper.normTime(logParsed.connect),
        serviceTime = Helper.normTime(logParsed.service),
        respTime = connectTime + serviceTime,
        curUrlEntry,
        idx;

    for (idx in monitoringUrls) {
        if (this.config.monitoringUrls.hasOwnProperty(idx)) {
            curUrlEntry = this.config.monitoringUrls[idx];
            if (curUrlEntry.urlRegExp.test(logLine)) {
                break;
            }
        }
    }

    if (this.summary[curUrlEntry.name].dynos[dyno] === undefined) {
        this.summary[curUrlEntry.name].dynos[dyno] = 0;
    }

    this.summary[curUrlEntry.name].dynos[dyno] += 1;
    this.summary[curUrlEntry.name].reqNumber += 1;
    this.summary[curUrlEntry.name].respTimeList.push(respTime);
};

LogAnalytics.prototype.printSummary = function () {
    var self = this,
        summary = this.summary,
        sumKeys = Object.keys(this.summary),
        curSumEntry,
        sortedRespTime,
        mean,
        median,
        mode,
        mostCalledDyno,
        reqNum;

    sumKeys.forEach(function (key) {
        curSumEntry = summary[key];
        sortedRespTime = Helper.sortNumList(curSumEntry.respTimeList);
        mostCalledDyno = Helper.mostCalledDyno(curSumEntry.dynos);
        reqNum = curSumEntry.reqNumber;
        mean = Helper.mean(sortedRespTime);
        median = Helper.median(sortedRespTime);
        mode = Helper.mode(sortedRespTime);
        mode = (typeof mode === 'number') ? mode + ' ms' : mode;

        if (typeof mean === 'number') {
            mean = (mean % 1 === 0) ? mean + ' ms' : mean.toFixed(2) + ' ms';
        }

        if (typeof median === 'number') {
            median = (median % 1 === 0) ? median + ' ms' : median.toFixed(2) + ' ms';
        }

        console.log(
            self.config.resultTemplate,
            Chalk.green(curSumEntry.analyticsUrl),
            reqNum > 1 ? reqNum + ' times' : reqNum + ' time',
            mean === 'N/A' ? Chalk.dim(mean) : mean,
            median === 'N/A' ? Chalk.dim(median) : median,
            mode === 'N/A' ? Chalk.dim(mode) : mode,
            mostCalledDyno === 'N/A' ? 
                Chalk.dim(mostCalledDyno) : mostCalledDyno
        );
    });
};

module.exports = function createLogAnalytics(config) {
    return new LogAnalytics(config);
};
