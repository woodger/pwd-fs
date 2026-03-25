"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_test_1 = require("node:test");
const index_1 = require("./index");
(0, node_test_1.describe)('#constructor: new PoweredFileSystem(pwd?)', () => {
    (0, node_test_1.it)('Positive: An empty path must match the context of the cwd', () => {
        const { pwd } = new index_1.PoweredFileSystem();
        (0, node_assert_1.default)(pwd === process.cwd());
    });
    (0, node_test_1.it)('Positive: Absolute path must match the context of the pwd', () => {
        const { pwd } = new index_1.PoweredFileSystem(__dirname);
        (0, node_assert_1.default)(pwd === __dirname);
    });
});
