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
(0, node_test_1.describe)('test(src[, options])', () => {
    const chance = new chance_1.default();
    let tmpDir = '';
    (0, node_test_1.beforeEach)(() => {
        tmpDir = (0, test_utils_1.createTmpDir)();
        (0, test_utils_1.fmock)({
            [node_path_1.default.join(tmpDir, 'tings.txt')]: {
                type: 'file',
                data: chance.string()
            },
            [node_path_1.default.join(tmpDir, 'digest')]: { type: 'directory' }
        });
    });
    (0, node_test_1.afterEach)(() => {
        (0, test_utils_1.restore)(tmpDir);
    });
    (0, node_test_1.it)(`Positive: Should return 'true' for current working directory`, async () => {
        const exist = await index_1.pfs.test('.');
        (0, node_assert_1.default)(exist);
    });
    (0, node_test_1.it)(`Positive: For existing file should return 'true'`, async () => {
        const exist = await index_1.pfs.test(node_path_1.default.join(tmpDir, 'tings.txt'));
        (0, node_assert_1.default)(exist);
    });
    (0, node_test_1.it)(`Positive: For existing directory should return 'true'`, async () => {
        const exist = await index_1.pfs.test(node_path_1.default.join(tmpDir, 'digest'));
        (0, node_assert_1.default)(exist);
    });
    (0, node_test_1.it)(`Positive: A non-existent file must return 'false'`, async () => {
        const guid = chance.guid();
        const exist = await index_1.pfs.test(node_path_1.default.join(tmpDir, guid));
        (0, node_assert_1.default)(exist === false);
    });
    (0, node_test_1.it)(`Positive: For existing file should return 'true'`, () => {
        const exist = index_1.pfs.test(node_path_1.default.join(tmpDir, 'tings.txt'), {
            sync: true
        });
        (0, node_assert_1.default)(exist);
    });
    (0, node_test_1.it)(`[sync] Positive: For existing directory should return 'true'`, () => {
        const exist = index_1.pfs.test(node_path_1.default.join(tmpDir, 'digest'), {
            sync: true
        });
        (0, node_assert_1.default)(exist);
    });
    (0, node_test_1.it)(`[sync] Positive: A non-existent file must return 'false'`, () => {
        const guid = chance.guid();
        const exist = index_1.pfs.test(node_path_1.default.join(tmpDir, guid), {
            sync: true
        });
        (0, node_assert_1.default)(exist === false);
    });
    (0, node_test_1.it)('[sync] Positive: Should respect access flag checks', () => {
        node_fs_1.default.chmodSync(node_path_1.default.join(tmpDir, 'tings.txt'), 0o444);
        const writable = index_1.pfs.test(node_path_1.default.join(tmpDir, 'tings.txt'), {
            sync: true,
            flag: 'w'
        });
        (0, node_assert_1.default)(writable === false);
    });
});
