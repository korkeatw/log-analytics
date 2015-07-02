/**
 * @author Korkeat W. <korkeat.wannapat@gmail.com>
 * @description helper.js tests
 */

'use strict';

var Assert = require('assert'),
    Helper = require('../lib/helper');

describe('helper.js tests', function () {
    var assert;

    before(function () {
        assert = Assert;
    });

    it('normQuotes() should removes all quotes', function (done) {
        assert.equal(Helper.normQuotes('"127.0.0.1"'), '127.0.0.1');
        assert.equal(Helper.normQuotes('""'), '');
        done();
    });

    it('normTime() should removes time that tailing with \'ms\'', function (done) {
        assert.equal(Helper.normTime('10ms'), 10);
        assert.equal(Helper.normTime('ms'), 0);
        done();
    });

    it('sortNumList() should returns sorted list', function (done) {
        assert.deepEqual(
            Helper.sortNumList([0, 2, 10, 1, 5]),
            [0, 1, 2, 5, 10]
        );
        assert.deepEqual(Helper.sortNumList([]), []);
        done();
    });

    it('mean of [0, 1, 2, 3, 4, 5] should be 2.5', function (done) {
        assert.equal(Helper.mean([0, 1, 2, 3, 4, 5]), 2.5);
        done();
    });

    it('median of [1, 2, 3, 4, 5, 6] should be 3.5', function (done) {
        assert.equal(Helper.median([1, 2, 3, 4, 5, 6]), 3.5);
        done();
    });

    it('mode of [1, 1, 3, 2, 1, 10] should be 1', function (done) {
        assert.equal(Helper.mode([1, 1, 3, 2, 1, 10]), 1);
        done();
    });

    it('sortObjectByValue() should returns list of sorted object', function (done) {
        var expect = [
                {key: 'key2', val: 0},
                {key: 'key1', val: 1},
                {key: 'key3', val: 2},
                {key: 'key4', val: 3}
            ],
            testObj = {
                key1: 1,
                key2: 0,
                key3: 2,
                key4: 3
            };
        assert.deepEqual(Helper.sortObjectByValue(testObj), expect);
        done();
    });
});
