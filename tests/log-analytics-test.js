/**
 * @author Korkeat W. <korkeat.wannapat@gmail.com>
 * @description log-analytics.js tests
 */

'use strict';

var Assert = require('assert'),
    LogAnalytics = require('../lib/log-analytics'),
    Config = require('../config/config-for-test');

describe('log-analytics.js tests', function () {
    var assert,
        analytics;

    before(function () {
        assert = Assert;
        analytics = new LogAnalytics(Config);
    });

    it('LogAnalytics object should throw an error If config object is empty',
        function (done) {
            assert.throws(
                function () {
                    LogAnalytics({});
                },
                Error
            );
            done();
        });

    it('LogAnalytics should pass if config object is not empty',
        function (done) {
            assert.doesNotThrow(
                function () {
                    LogAnalytics(Config);
                },
                Error
            );
            done();
        });

    it('readLog() should returns list of log line', function (done) {
        assert.deepEqual(
            analytics.readLog(),
            [
                '2014-01-09T06:16:53.748849+00:00 heroku[router]: at=info method=POST path=/api/online/platforms/facebook_canvas/users/100002266342173/add_ticket host=services.pocketplaylab.com fwd="94.66.255.106" dyno=web.12 connect=12ms service=21ms status=200 bytes=78',
                '2014-01-09T06:16:53.742892+00:00 heroku[router]: at=info method=GET path=/api/users/100002266342173/count_pending_messages host=services.pocketplaylab.com fwd="94.66.255.106" dyno=web.8 connect=9ms service=9ms status=304 bytes=0',
                '2014-01-09T06:16:53.766841+00:00 heroku[router]: at=info method=POST path=/logs/save_personal_data host=services.pocketplaylab.com fwd="5.13.87.91" dyno=web.10 connect=1ms service=42ms status=200 bytes=16'
            ]
        );
        done();
    });

    it('readLogStream() should not returns undefined', function (done) {
        assert.notEqual(analytics.readLogStream(), undefined);
        done();
    });
});
