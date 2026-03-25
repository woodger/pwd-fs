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
(0, node_test_1.describe)('symlink(src, use [, options])', () => {
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
    (0, node_test_1.it)('Positive: Must be created a symbolic link', async () => {
        await index_1.pfs.symlink(node_path_1.default.join(tmpDir, 'tings.txt'), node_path_1.default.join(tmpDir, 'linkapp'));
        const stat = node_fs_1.default.lstatSync(node_path_1.default.join(tmpDir, 'linkapp'));
        (0, node_assert_1.default)(stat.isSymbolicLink());
    });
    (0, node_test_1.it)('Positive: Must be created a symbolic link for directory', async () => {
        await index_1.pfs.symlink(node_path_1.default.join(tmpDir, 'digest'), node_path_1.default.join(tmpDir, 'linkapp'));
        const stat = node_fs_1.default.lstatSync(node_path_1.default.join(tmpDir, 'linkapp'));
        (0, node_assert_1.default)(stat.isSymbolicLink());
    });
    (0, node_test_1.it)('Negative: Throw if destination already exists', async () => {
        await node_assert_1.default.rejects(async () => {
            await index_1.pfs.symlink(node_path_1.default.join(tmpDir, 'tings.txt'), node_path_1.default.join(tmpDir, 'flexapp'));
        });
    });
    (0, node_test_1.it)('[sync] Positive: Must be created a symbolic link', () => {
        index_1.pfs.symlink(node_path_1.default.join(tmpDir, 'tings.txt'), node_path_1.default.join(tmpDir, 'linkapp'), {
            sync: true
        });
        const stat = node_fs_1.default.lstatSync(node_path_1.default.join(tmpDir, 'linkapp'));
        (0, node_assert_1.default)(stat.isSymbolicLink());
    });
    (0, node_test_1.it)('[sync] Positive: Must be created a symbolic link for directory', () => {
        index_1.pfs.symlink(node_path_1.default.join(tmpDir, 'digest'), node_path_1.default.join(tmpDir, 'linkapp'), {
            sync: true
        });
        const stat = node_fs_1.default.lstatSync(node_path_1.default.join(tmpDir, 'linkapp'));
        (0, node_assert_1.default)(stat.isSymbolicLink());
    });
    (0, node_test_1.it)('[sync] Negative: Throw if destination already exists', () => {
        node_assert_1.default.throws(() => {
            index_1.pfs.symlink(node_path_1.default.join(tmpDir, 'tings.txt'), node_path_1.default.join(tmpDir, 'flexapp'), {
                sync: true
            });
        });
    });
});
