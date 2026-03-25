"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_fs_1 = __importDefault(require("node:fs"));
const chance_1 = __importDefault(require("chance"));
const node_test_1 = require("node:test");
const index_1 = require("../index");
const test_utils_1 = require("../test-utils");
(0, node_test_1.describe)('remove(src [, options])', { concurrency: false }, () => {
    const chance = new chance_1.default();
    (0, node_test_1.beforeEach)(() => {
        const cwd = process.cwd();
        const frame = {
            './tmpdir/tings.txt': {
                type: 'file',
                data: chance.string()
            },
            './tmpdir/digest/': { type: 'directory' },
            './tmpdir/flexapp': {
                type: 'symlink',
                target: `${cwd}/tmpdir/tings.txt`
            },
            './tmpdir/digest-link': {
                type: 'symlink',
                target: `${cwd}/tmpdir/digest`
            }
        };
        const counter = chance.natural({ max: 7 });
        for (let i = 0; i < counter; i++) {
            frame[`./tmpdir/${i}`] = { type: 'directory' };
        }
        (0, test_utils_1.fmock)(frame);
    });
    (0, node_test_1.afterEach)(() => {
        (0, test_utils_1.restore)('./tmpdir');
    });
    (0, node_test_1.it)('Positive: Removal a directory with a file', async () => {
        await index_1.pfs.remove('./tmpdir');
        const exist = node_fs_1.default.existsSync('./tmpdir');
        (0, node_assert_1.default)(exist === false);
    });
    (0, node_test_1.it)('Negative: Throw if not exists resource', async () => {
        const guid = chance.guid();
        await node_assert_1.default.rejects(async () => {
            await index_1.pfs.remove(`./${guid}`);
        });
    });
    (0, node_test_1.it)('[sync] Positive: Removal a directory with a file', () => {
        index_1.pfs.remove('./tmpdir', {
            sync: true
        });
        const exist = node_fs_1.default.existsSync('./tmpdir');
        (0, node_assert_1.default)(exist === false);
    });
    (0, node_test_1.it)('[sync] Negative: Throw if not exists resource', () => {
        const guid = chance.guid();
        node_assert_1.default.throws(() => {
            index_1.pfs.remove(`./tmpdir/${guid}`, {
                sync: true
            });
        });
    });
    (0, node_test_1.it)('[sync] Positive: Removing a symlink to a directory should remove only the link', () => {
        index_1.pfs.remove('./tmpdir/digest-link', {
            sync: true
        });
        (0, node_assert_1.default)(node_fs_1.default.existsSync('./tmpdir/digest-link') === false);
        (0, node_assert_1.default)(node_fs_1.default.existsSync('./tmpdir/digest'));
    });
});
