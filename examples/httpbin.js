'use strict';
const GoferRetry = require('../lib');

class HTTPBin extends GoferRetry {
    constructor(config, hub) {
        super(config, hub);
        this.registerEndpoints(this.endpoints);
    }
    get serviceName() {
        return 'httpbin';
    }
    get serviceVersion() {
        return '1.0';
    }
    get endpoints() {
        return {
            status: (request) => {
                return (code, cb) => {
                    // you define as the first argument the endpoint name
                    // this allows retry to use endpointDefault configs.
                    return this.retry('status', request, {
                        uri: '/status/{code}',
                        pathParams: {
                            code: code
                        }
                    }, cb)
                };
            }
        }
    }
}

const api = new HTTPBin({
    // these apply to all gofers
    globalDefaults: {
        baseUrl: 'https://httpbin.org',
        retry: {
            retries: 0
        }
    },
    // these apply to all 'httpbin' gofers
    httpbin: {
        retry: {
            retries: 1
        },
        endpointDefaults: {
            // these only apply for calls to the status endpoint
            status: {
                retry: {
                    retries: 2
                }
            }
        }
    }
});

/*eslint-disable */
api.status(200, (err, body, meta) => {
    // no retry as it is a happy code
    console.log(err, meta);
});

api.status(500, (err, body, meta) => {
    // this will retry twice, for a total of 3 calls since we set the endpointDefault to 2.
    console.log(err.message, meta.attempts);
});
/*eslint-enable */
