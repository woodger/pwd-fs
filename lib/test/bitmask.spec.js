"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const src_1 = require("../src");
describe('static bitmask(mode: number)', () => {
    it('Positive: Calculate bitmask', () => {
        (0, node_assert_1.default)((0, src_1.bitmask)(33024) === 0o400); // (r--------)
        (0, node_assert_1.default)((0, src_1.bitmask)(33152) === 0o600); // (rw-------)
        (0, node_assert_1.default)((0, src_1.bitmask)(33216) === 0o700); // (rwx------)
        (0, node_assert_1.default)((0, src_1.bitmask)(32800) === 0o040); // (---r-----)
        (0, node_assert_1.default)((0, src_1.bitmask)(32816) === 0o060); // (---rw----)
        (0, node_assert_1.default)((0, src_1.bitmask)(32824) === 0o070); // (---rwx---)
        (0, node_assert_1.default)((0, src_1.bitmask)(32772) === 0o004); // (------r--)
        (0, node_assert_1.default)((0, src_1.bitmask)(32774) === 0o006); // (------rw-)
        (0, node_assert_1.default)((0, src_1.bitmask)(32775) === 0o007); // (------rwx)
    });
    it(`Negative: Throw an exception if the argument is 'null' type`, () => {
        node_assert_1.default.throws(() => {
            // @ts-ignore
            (0, src_1.bitmask)(null);
        });
    });
});
