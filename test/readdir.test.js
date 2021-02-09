const assert = require('assert');
const mockFs = require('mock-fs');
const PoweredFileSystem = require('../dist');

describe('pfs.readdir(src[, options])', () => {
  const pfs = new PoweredFileSystem();

  describe('Interface', () => {
    it('Throw an exception if the option argument is not a object', async () => {
      try {
        await pfs.readdir('./dir', null);
      }
      catch (err) {
        assert(err instanceof TypeError);
      }
    });

    const options = {
      resolve: Boolean,
      sync: Boolean
    };

    for (let i of Object.keys(options)) {
      const {name} = options[i];

      it(`Throw an exception if '${i}' value is not a ${name}`, async () => {
        try {
          await pfs.readdir('./dir', {
            [i]: null
          });
        }
        catch (err) {
          assert(
            err.message ===
            `Invalid value '${i}' in order '#readdir()'. Expected ${name}`
          );
        }
      });
    }
  });

  describe('File system access', () => {
    before(() => {
      mockFs({
        'dir/file.txt': ''
      });
    });

    after(() => {
      mockFs.restore();
    });

    it('Must return a directory listing', async () => {
      const [first] = await pfs.readdir('./dir');
      assert(first === 'file.txt');
    });

    it(`Must return a directory listing in 'sync' mode`, async () => {
      const [first] = pfs.readdir('./dir', {
        sync: true
      });

      assert(first === 'file.txt');
    });

    it('To a non-existent resource to return an Error', async () => {
      try {
        await pfs.readdir('./non-existent');
      }
      catch (err) {
        const index = err.message.indexOf('ENOENT, no such file or directory');
        assert(index > -1);
      }
    });
  });
});
