'use strict';
const Gofer = require('gofer');
const Retry = require('retry');

class GoferRetry extends Gofer {
    constructor(config, hub) {
        super(config, hub);
        this.addOptionMapper(GoferRetry.retryMapper);
    }
    static retryMapper(opts) {
        // if retries is mentioned, default to 0 retries.
        if (opts.retry && typeof opts.retry.retires === 'undefined') {
            opts.retry.retries = 0;
        }

        return opts;
    }
    retry(endpoint, request, options, cb) {
        const op = Retry.operation((this.endpointDefaults[endpoint] && this.endpointDefaults[endpoint].retry) || this.defaults.retry);
        delete options.retry;
        return op.attempt(() => {
            return request(options, (err, body, meta, response) => {
                if (op.retry(err)) {
                    return;
                }
                meta = meta || {};
                meta.attempts = op.attempts();
                meta.errors = op.errors();
                cb(err ? op.mainError() : null, body, meta, response);
            })
        });
    }
}

module.exports = GoferRetry;
