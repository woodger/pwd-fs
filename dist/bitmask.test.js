"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_test_1 = require("node:test");
const index_1 = require("./index");
(0, node_test_1.describe)('static bitmask(mode: number)', { concurrency: false }, () => {
    (0, node_test_1.it)('Positive: Calculate bitmask', () => {
        (0, node_assert_1.default)((0, index_1.bitmask)(33024) === 0o400);
        (0, node_assert_1.default)((0, index_1.bitmask)(33152) === 0o600);
        (0, node_assert_1.default)((0, index_1.bitmask)(33216) === 0o700);
        (0, node_assert_1.default)((0, index_1.bitmask)(32800) === 0o040);
        (0, node_assert_1.default)((0, index_1.bitmask)(32816) === 0o060);
        (0, node_assert_1.default)((0, index_1.bitmask)(32824) === 0o070);
        (0, node_assert_1.default)((0, index_1.bitmask)(32772) === 0o004);
        (0, node_assert_1.default)((0, index_1.bitmask)(32774) === 0o006);
        (0, node_assert_1.default)((0, index_1.bitmask)(32775) === 0o007);
    });
    (0, node_test_1.it)(`Negative: Throw an exception if the argument is 'null' type`, () => {
        node_assert_1.default.throws(() => {
            (0, index_1.bitmask)(null);
        });
    });
});
