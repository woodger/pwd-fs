"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const chance_1 = __importDefault(require("chance"));
const node_test_1 = require("node:test");
const index_1 = require("../index");
const test_utils_1 = require("../test-utils");
/**
 * Covers recursive removal, including the symlink edge case.
 */
(0, node_test_1.describe)('remove(src [, options])', () => {
    const chance = new chance_1.default();
    let tmpDir = '';
    (0, node_test_1.beforeEach)(() => {
        tmpDir = (0, test_utils_1.createTmpDir)();
        const frame = {
            [node_path_1.default.join(tmpDir, 'tings.txt')]: {
                type: 'file',
                data: chance.string()
            },
            [node_path_1.default.join(tmpDir, 'digest')]: { type: 'directory' },
            [node_path_1.default.join(tmpDir, 'flexapp')]: {
                type: 'symlink',
                target: node_path_1.default.join(tmpDir, 'tings.txt')
            },
            [node_path_1.default.join(tmpDir, 'digest-link')]: {
                type: 'symlink',
                target: node_path_1.default.join(tmpDir, 'digest')
            }
        };
        const counter = chance.natural({ max: 7 });
        for (let i = 0; i < counter; i++) {
            frame[node_path_1.default.join(tmpDir, String(i))] = { type: 'directory' };
        }
        (0, test_utils_1.fmock)(frame);
    });
    (0, node_test_1.afterEach)(() => {
        (0, test_utils_1.restore)(tmpDir);
    });
    (0, node_test_1.it)('Positive: Removal a directory with a file', async () => {
        await index_1.pfs.remove(tmpDir);
        const exist = node_fs_1.default.existsSync(tmpDir);
        (0, node_assert_1.default)(exist === false);
    });
    (0, node_test_1.it)('Negative: Throw if not exists resource', async () => {
        const guid = chance.guid();
        await node_assert_1.default.rejects(async () => {
            await index_1.pfs.remove(node_path_1.default.join(tmpDir, guid));
        });
    });
    (0, node_test_1.it)('[sync] Positive: Removal a directory with a file', () => {
        index_1.pfs.remove(tmpDir, {
            sync: true
        });
        const exist = node_fs_1.default.existsSync(tmpDir);
        (0, node_assert_1.default)(exist === false);
    });
    (0, node_test_1.it)('[sync] Negative: Throw if not exists resource', () => {
        const guid = chance.guid();
        node_assert_1.default.throws(() => {
            index_1.pfs.remove(node_path_1.default.join(tmpDir, guid), {
                sync: true
            });
        });
    });
    (0, node_test_1.it)('[sync] Positive: Removing a symlink to a directory should remove only the link', () => {
        index_1.pfs.remove(node_path_1.default.join(tmpDir, 'digest-link'), {
            sync: true
        });
        (0, node_assert_1.default)(node_fs_1.default.existsSync(node_path_1.default.join(tmpDir, 'digest-link')) === false);
        (0, node_assert_1.default)(node_fs_1.default.existsSync(node_path_1.default.join(tmpDir, 'digest')));
    });
});
