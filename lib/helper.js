/**
 * @author Korkeat W. <korkeat.wannapat@gmail.com>
 */

'use strict';

var helper = {};

helper.normQuotes = function (text) {
    return text.replace(/\"/g, '');
};

helper.normTime = function (text) {
    return Number(text.replace(/ms$/, ''));
};

helper.sortNumList = function (numList) {
    numList = numList.sort(function (prev, cur) {
        return prev - cur;
    });
    return numList;
};

helper.mean = function (numList) {
    var listLen = numList.length,
        sumList;

    if (listLen === 0) {
        return 'N/A';
    }

    sumList = numList.reduce(function (prev, cur) {
        return prev + cur;
    });

    return listLen === 0 ? 0 : sumList / listLen;
};

helper.median = function (numList) {
    var listLen = numList.length,
        median,
        secondMiddle,
        firstMiddle;

    if (listLen === 0) {
        return 'N/A';
    }

    if (listLen % 2 === 0) {
        secondMiddle = listLen / 2;
        firstMiddle = (listLen / 2) - 1;
        median = (numList[secondMiddle] + numList[firstMiddle]) / 2;
    } else {
        median = Math.floor(listLen / 2);
    }

    return median;
};

helper.mode = function (numList) {
    var map = {},
        sorted;

    if (numList.length === 0) {
        return 'N/A';
    }

    numList.forEach(function (num) {
        if (map[num] === undefined) {
            map[num] = 0;
        }
        map[num] += 1;
    });

    sorted = helper.sortObjectByValue(map);
    return Number(sorted[sorted.length - 1].key);
};

helper.sortObjectByValue = function (obj) {
    if (typeof obj !== 'object') {
        throw new TypeError('input must be Object');
    }

    if (Object.getOwnPropertyNames(obj).length === 0) {
        return [];
    }

    var sorted = Object.keys(obj).map(function (key) {
            var o = {};
            o.key = key;
            o.val = obj[key];
            return o;
        }).sort(function (prev, cur) {
            return prev.val - cur.val;
        });

    return sorted;
};

helper.mostCalledDyno = function (dynos) {
    var sorted = helper.sortObjectByValue(dynos);

    if (sorted.length === 0) {
        return 'N/A';
    }

    return sorted[sorted.length - 1].key;
};

module.exports = helper;
