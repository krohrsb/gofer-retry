'use strict';
const Lab = require('lab');
const Code = require('code');
const lab = exports.lab = Lab.script();

const expect = Code.expect;
// const before = lab.before;
// const after = lab.after;
const it = lab.it;
const describe = lab.describe;

const GoferRetry = require('../lib');

describe('constructor', () => {

    it('should allow no arguments', (done) => {
        const fn = () => {
            const gofer = new GoferRetry();
            expect(gofer).to.exist();
        };
        expect(fn).to.not.throw();
        done();
    });

    // TODO: finish tests
});

describe('retry', () => {

    it('should delete retry config from options', (done) => {
        const request = (options, cb) => {

            expect(options.retry).to.not.exist();
            cb();
        };
        const options = {
            retry: {
                test: true
            }
        };
        const gofer = new GoferRetry();
        gofer.retry('test', request, options, (err) => {
            expect(err).to.not.exist();
            done();
        });
    });

    it('should set attempts metadata', (done) => {
        const request = (options, cb) => {
            cb(null, {}, {});
        };
        const options = {};
        const gofer = new GoferRetry();
        gofer.retry('test', request, options, (err, body, meta) => {
            expect(err).to.not.exist();
            expect(meta).to.be.an.object();
            expect(meta.attempts).to.equal(1);
            done();
        });
    });

    it('should set errors metadata', (done) => {
        const request = (options, cb) => {
            cb(new Error('test-error'), {}, {});
        };
        const options = {
            retry: {
                retries: 0
            }
        };
        const gofer = new GoferRetry();
        gofer.retry('test', request, options, (err, body, meta) => {
            expect(err).to.exist();
            expect(meta).to.be.an.object();
            expect(meta.attempts).to.equal(1);
            expect(meta.errors).to.be.an.array();
            expect(meta.errors).to.have.length(1);
            expect(meta.errors[0]).to.deep.equal(err);
            done();
        });
    });

    it('should use endpoint defaults', (done) => {
        const request = (options, cb) => {
            cb(new Error('test-error'));
        };
        const options = {};
        const gofer = new GoferRetry();
        gofer.endpointDefaults = {
            test: {
                retry: {
                    retries: 1
                }
            }
        }
        gofer.retry('test', request, options, (err, body, meta) => {
            expect(err).to.exist();
            expect(meta).to.be.an.object();
            expect(meta.errors).to.have.length(2);
            expect(meta.attempts).to.equal(2);
            done();
        });
    });
});

describe('_retryMapper', () => {
    it('should set retry config retries property to 0 if not defined and retry config exists', (done) => {
        const options = {
            retry: {}
        };
        const result = GoferRetry._retryMapper(options);
        expect(result).to.be.an.object();
        expect(result.retry).to.be.an.object();
        expect(result.retry.retries).to.equal(0);
        done();
    });
    it('should not set retry config if it doesn\'t already exist', (done) => {
        const options = {};
        const result = GoferRetry._retryMapper(options);
        expect(result).to.be.an.object();
        expect(result.retry).to.not.exist();
        expect(result).to.deep.equal(options);
        done();
    });
});
