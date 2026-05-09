"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_path_1 = __importDefault(require("node:path"));
const node_test_1 = require("node:test");
const index_1 = require("./index");
const test_utils_1 = require("./test-utils");
/**
 * Verifies constructor path resolution semantics for the main API surface.
 */
(0, node_test_1.describe)('#constructor: new PoweredFileSystem(pwd?)', () => {
    (0, node_test_1.it)('Positive: An empty path must match the context of the cwd', () => {
        const { pwd } = new index_1.PoweredFileSystem();
        (0, node_assert_1.default)(pwd === process.cwd());
    });
    (0, node_test_1.it)('Positive: Absolute path must match the context of the pwd', () => {
        const { pwd } = new index_1.PoweredFileSystem(__dirname);
        (0, node_assert_1.default)(pwd === __dirname);
    });
    (0, node_test_1.it)('Positive: Resolve should accept paths inside the working directory', () => {
        const tmpDir = (0, test_utils_1.createTmpDir)();
        try {
            const pfs = new index_1.PoweredFileSystem(tmpDir);
            const resolved = pfs.resolve('./nested/file.txt');
            (0, node_assert_1.default)(resolved === node_path_1.default.join(tmpDir, 'nested', 'file.txt'));
        }
        finally {
            (0, test_utils_1.restore)(tmpDir);
        }
    });
    (0, node_test_1.it)('Positive: Resolve should preserve absolute paths outside the working directory', () => {
        const tmpDir = (0, test_utils_1.createTmpDir)();
        const outsidePath = node_path_1.default.resolve(node_path_1.default.dirname(tmpDir), 'outside.txt');
        try {
            const pfs = new index_1.PoweredFileSystem(tmpDir);
            const resolved = pfs.resolve(outsidePath);
            (0, node_assert_1.default)(resolved === outsidePath);
        }
        finally {
            (0, test_utils_1.restore)(tmpDir);
        }
    });
});
