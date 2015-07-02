/**
 * @author Korkeat W. <korkeat.wannapat@gmail.com>
 * @description Configuration file
 */

var config = {};

 /**
 * target file
 */
config.targetLogPath = './data/sample-for-test.log';

/**
 * configuration target urls to be analyzed
 */
config.monitoringUrls = [
    {
        name: 'get:count_pending_messages',
        path: 'GET /api/users/{user_id}/count_pending_messages',
        urlPattern: 'method=GET path=/api/users/\\d+/count_pending_messages ',
        urlRegExp: new RegExp(/ method=GET path=\/api\/users\/\d+\/count_pending_messages /)
    },
    {
        name: 'get:get_messages',
        path: 'GET /api/users/{user_id}/get_messages',
        urlPattern: 'method=GET path=/api/users/\\d+/get_messages ',
        urlRegExp: new RegExp(/ method=GET path=\/api\/users\/\d+\/get_messages /)
    },
    {
        name: 'get:get_friends_progress',
        path: 'GET /api/users/{user_id}/get_friends_progress',
        urlPattern: 'method=GET path=/api/users/\\d+/get_friends_progress ',
        urlRegExp: new RegExp(/ method=GET path=\/api\/users\/\d+\/get_friends_progress /)
    },
    {
        name: 'get:get_friends_score',
        path: 'GET /api/users/{user_id}/get_friends_score',
        urlPattern: 'method=GET path=/api/users/\\d+/get_friends_score ',
        urlRegExp: new RegExp(/ method=GET path=\/api\/users\/\d+\/get_friends_score /)
    },
    {
        name: 'post:users',
        path: 'POST /api/users/{user_id}',
        urlPattern: ' method=POST path=/api/users/\\d+ ',
        urlRegExp: new RegExp(/method=POST path=\/api\/users\/\d+ /)
    },
    {
        name: 'get:users',
        path: 'GET /api/users/{user_id}',
        urlPattern: ' method=GET path=/api/users/\\d+ ',
        urlRegExp: new RegExp(/ method=GET path=\/api\/users\/\d+ /)
    }
];

/**
 * output template
 */
config.resultTemplate = '%s\n' +
    '\tcalledNumber\t=\t%s\n' +
    '\trespTimeMean\t=\t%s\n' +
    '\trespTimeMedian\t=\t%s\n' +
    '\trespTimeMode\t=\t%s\n' +
    '\tmostCalledDyno\t=\t%s';

module.exports = config;
