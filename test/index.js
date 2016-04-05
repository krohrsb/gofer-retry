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
})
