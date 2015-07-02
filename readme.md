Log Analytics
====

Simple log analytics written in Node.js.

## Dependencies
The project developed and tested under this environments:

- Ubuntu 15.04
- Node.js 0.12.5
- NPM 2.10.1

It's also work fine on other platforms.

The project doesn't required any special Node.js modules but you may install
development dependencies such as code quality tool, test framework etc.
if you want to use it.

## Usage
The first step, you have to ```git clone``` source code.

```
$git clone git@github.com:khasathan/log-analytics.git
$cd log-analytics
```

After that, replace ```config/config.js``` as your own value. Now, It's ready
to use. You can run script by:

```
$node analytics.js
```

### The Result
If you haven't not get any errors. The result will be like this

```
GET /api/users/{user_id}/count_pending_messages
    calledNumber     =     2430 times
    respTimeMean     =     26 ms
    respTimeMedian   =     15 ms
    respTimeMode     =     11 ms
    mostCalledDyno   =     web.2
GET /api/users/{user_id}/get_messages
    calledNumber     =     652 times
    respTimeMean     =     62.17 ms
    respTimeMedian   =     32 ms
    respTimeMode     =     23 ms
    mostCalledDyno   =     web.11
GET /api/users/{user_id}/get_friends_progress
    calledNumber     =      1117 times
    respTimeMean     =      111.90 ms
    respTimeMedian   =      558 ms
    respTimeMode     =      35 ms
    mostCalledDyno   =      web.5
GET /api/users/{user_id}/get_friends_score
    calledNumber     =      1533 times
    respTimeMean     =      228.77 ms
    respTimeMedian   =      766 ms
    respTimeMode     =      67 ms
    mostCalledDyno   =      web.7
POST /api/users/{user_id}
    calledNumber     =      2022 times
    respTimeMean     =      82.78 ms
    respTimeMedian   =      46 ms
    respTimeMode     =      23 ms
    mostCalledDyno   =      web.11
GET /api/users/{user_id}
    calledNumber     =       0 time
    respTimeMean     =       N/A
    respTimeMedian   =       N/A
    respTimeMode     =       N/A
    mostCalledDyno   =       N/A
```

For view execution time of the script so, you can follow this command to due
with it.

```
$time node analytics.js
...
...
GET /api/users/{user_id}
    calledNumber     =       0 time
    respTimeMean     =       N/A
    respTimeMedian   =       N/A
    respTimeMode     =       N/A
    mostCalledDyno   =       N/A

node analytics.js  1.13s user 0.06s system 98% cpu 1.257 total
```

>__NOTE:__ The format of result depend on your operating system Shell

### Version of the script
The analytics scripts provided for 2 versions

1. ```analytics.js``` is use for regular file. It's split each line of log into
list.
2. ```analytics-stream.js``` designed for very large file It's use Streaming
API to read file. This is for solve memory usage issue.
