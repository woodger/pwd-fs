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
(0, node_test_1.describe)('append(src, data [, options])', { concurrency: false }, () => {
    const chance = new chance_1.default();
    (0, node_test_1.beforeEach)(() => {
        (0, test_utils_1.fmock)({
            './tmpdir/tings.txt': {
                type: 'file',
                data: 'hoodie'
            }
        });
    });
    (0, node_test_1.afterEach)(() => {
        (0, test_utils_1.restore)('./tmpdir');
    });
    (0, node_test_1.it)('Positive: Must append content to file', async () => {
        const payload = chance.paragraph();
        await index_1.pfs.append('./tmpdir/tings.txt', payload);
        const { size } = node_fs_1.default.statSync('./tmpdir/tings.txt');
        (0, node_assert_1.default)(payload.length + 6 === size);
    });
    (0, node_test_1.it)('[sync] Positive: Must append content to file', () => {
        const payload = chance.paragraph();
        index_1.pfs.append('./tmpdir/tings.txt', payload, {
            sync: true
        });
        const { size } = node_fs_1.default.statSync('./tmpdir/tings.txt');
        (0, node_assert_1.default)(payload.length + 6 === size);
    });
});
