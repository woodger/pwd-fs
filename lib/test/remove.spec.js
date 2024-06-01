"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_fs_1 = __importDefault(require("node:fs"));
const chance_1 = __importDefault(require("chance"));
const expect_1 = require("expect");
const __fmock_1 = require("./__fmock");
const src_1 = require("../src");
describe('remove(src [, options])', () => {
    const chance = new chance_1.default();
    beforeEach(() => {
        const cwd = process.cwd();
        const frame = {
            './tmpdir/tings.txt': {
                type: 'file',
                data: chance.string()
            },
            './tmpdir/flexapp': {
                type: 'symlink',
                target: `${cwd}/tmpdir/tings.txt`
            }
        };
        const counter = chance.natural({ max: 7 });
        for (let i = 0; i < counter; i++) {
            frame[`./tmpdir/${i}`] = { type: 'directory' };
        }
        (0, __fmock_1.fmock)(frame);
    });
    afterEach(() => {
        (0, __fmock_1.restore)('./tmpdir');
    });
    it('Positive: Removal a directory with a file', async () => {
        await src_1.pfs.remove('./tmpdir');
        const exist = node_fs_1.default.existsSync(`./tmpdir`);
        (0, node_assert_1.default)(exist === false);
    });
    it('Negative: Throw if not exists resource', async () => {
        const guid = chance.guid();
        await (0, expect_1.expect)(async () => {
            await src_1.pfs.remove(`./${guid}`);
        })
            .rejects
            .toThrow();
    });
    it('[sync] Positive: Removal a directory with a file', () => {
        src_1.pfs.remove('./tmpdir', {
            sync: true
        });
        const exist = node_fs_1.default.existsSync(`./tmpdir`);
        (0, node_assert_1.default)(exist === false);
    });
    it('[sync] Negative: Throw if not exists resource', () => {
        const guid = chance.guid();
        node_assert_1.default.throws(() => {
            src_1.pfs.remove(`./tmpdir/${guid}`, {
                sync: true
            });
        });
    });
});
