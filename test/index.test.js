const assert = require('assert');
const {describe, it} = require('mocha');


const tests = [
  'bitmask',
  'constructor',
  'test',
  'stat',
  'chmod',
  'chown',
  'symlink',
  'copy',
  'rename',
  'remove',
  'read',
  'write',
  'append',
  'readdir',
  'mkdir'
];


describe(`class FileSystem`, function() {
  for (let i of tests) {
    require(`./${i}.test.js`);
  }
});
