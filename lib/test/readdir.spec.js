"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const chance_1 = __importDefault(require("chance"));
const expect_1 = require("expect");
const __fmock_1 = require("./__fmock");
const src_1 = require("../src");
describe('readdir(src[, options])', () => {
    const chance = new chance_1.default();
    let counter = 0;
    beforeEach(() => {
        const frame = {
            './tmpdir/tings.txt': {
                type: 'file',
                data: chance.string()
            }
        };
        counter = chance.natural({ max: 7 });
        for (let i = 0; i < counter; i++) {
            frame[`./tmpdir/${i}`] = { type: 'directory' };
        }
        (0, __fmock_1.fmock)(frame);
    });
    afterEach(() => {
        (0, __fmock_1.restore)('./tmpdir');
    });
    it('Positive: Must return a directory listing', async () => {
        const { length } = await src_1.pfs.readdir('./tmpdir');
        (0, node_assert_1.default)(counter + 1 === length);
    });
    it('Negative: Throw if resource is not directory', async () => {
        await (0, expect_1.expect)(async () => {
            await src_1.pfs.readdir(`./tmpdir/tings.txt`);
        })
            .rejects
            .toThrow();
    });
    it('Negative: Throw if not exists resource', async () => {
        const guid = chance.guid();
        await (0, expect_1.expect)(async () => {
            await src_1.pfs.readdir(`./tmpdir/${guid}`);
        })
            .rejects
            .toThrow();
    });
    it('[sync] Positive: Must return a directory listing', () => {
        const { length } = src_1.pfs.readdir('./tmpdir', {
            sync: true
        });
        (0, node_assert_1.default)(counter + 1 === length);
    });
    it('Negative: Throw if resource is not directory', () => {
        node_assert_1.default.throws(() => {
            src_1.pfs.readdir(`./tmpdir/tings.txt`, {
                sync: true
            });
        });
    });
    it(`Negative: Throw if not exists resource`, () => {
        const guid = chance.guid();
        node_assert_1.default.throws(() => {
            src_1.pfs.readdir(`./tmpdir/${guid}`, {
                sync: true
            });
        });
    });
});
