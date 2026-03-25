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
 * Covers the deprecated append helper in both async and sync modes.
 */
(0, node_test_1.describe)('append(src, data [, options])', () => {
    const chance = new chance_1.default();
    let tmpDir = '';
    (0, node_test_1.beforeEach)(() => {
        tmpDir = (0, test_utils_1.createTmpDir)();
        (0, test_utils_1.fmock)({
            [node_path_1.default.join(tmpDir, 'tings.txt')]: {
                type: 'file',
                data: 'hoodie'
            }
        });
    });
    (0, node_test_1.afterEach)(() => {
        (0, test_utils_1.restore)(tmpDir);
    });
    (0, node_test_1.it)('Positive: Must append content to file', async () => {
        const payload = chance.paragraph();
        const filePath = node_path_1.default.join(tmpDir, 'tings.txt');
        await index_1.pfs.append(filePath, payload);
        const { size } = node_fs_1.default.statSync(filePath);
        (0, node_assert_1.default)(payload.length + 6 === size);
    });
    (0, node_test_1.it)('[sync] Positive: Must append content to file', () => {
        const payload = chance.paragraph();
        const filePath = node_path_1.default.join(tmpDir, 'tings.txt');
        index_1.pfs.append(filePath, payload, {
            sync: true
        });
        const { size } = node_fs_1.default.statSync(filePath);
        (0, node_assert_1.default)(payload.length + 6 === size);
    });
});
