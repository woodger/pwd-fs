const assert = require('assert');
const mockFs = require('mock-fs');
const PoweredFileSystem = require('..');

describe('pfs.read(src [, options])', () => {
  const pfs = new PoweredFileSystem();

  describe('Interface', () => {
    it('Throw an exception if the option argument is not a object', async () => {
      try {
        await pfs.read('./dir/file.txt', null);
      }
      catch (err) {
        assert(err.message === "Cannot destructure property `encoding` of 'undefined' or 'null'.");
      }
    });

    const options = {
      encoding: String,
      resolve: Boolean,
      sync: Boolean
    };

    for (let i of Object.keys(options)) {
      const {name} = options[i];

      it(`Throw an exception if '${i}' value is not a ${name}`, async () => {
        try {
          await pfs.read('./dir/file.txt', {
            [i]: null
          });
        }
        catch (err) {
          assert(
            err.message ===
            `Invalid value '${i}' in order '#read()'. Expected ${name}`
          );
        }
      });
    }
  });

  describe('File system access', () => {
    before(() => {
      mockFs({
        'dir/file.txt': 'some text ...'
      });
    });

    after(() => {
      mockFs.restore();
    });

    it('Must ead file content', async () => {
      const content = await pfs.read('./dir/file.txt');
      assert(content === 'some text ...');
    });

    it(`Must ead file content in 'sync' mode`, async () => {
      const content = pfs.read('./dir/file.txt', {
        sync: true
      });

      assert(content === 'some text ...');
    });

    it('To a non-existent resource to return an Error', async () => {
      try {
        await pfs.read('./non-existent.txt');
      }
      catch (err) {
        const index = err.message.indexOf('ENOENT, no such file or directory');
        assert(index > -1);
      }
    });
  });
});
