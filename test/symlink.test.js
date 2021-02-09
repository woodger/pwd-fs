const assert = require('assert');
const mockFs = require('mock-fs');
const PoweredFileSystem = require('../dist');

describe('pfs.symlink(src, use [, options])', () => {
  const pfs = new PoweredFileSystem();

  describe('Interface', () => {
    it('Throw an exception if the option argument is not a object', async () => {
      try {
        await pfs.symlink('./dir/file.txt', './dir/link.txt', null);
      }
      catch (err) {
        assert(err instanceof Error);
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
          await pfs.symlink('./dir/file.txt', './dir/link.txt', {
            [i]: null
          });
        }
        catch (err) {
          assert(err instanceof Error);
        }
      });
    }
  });

  describe('File system access', () => {
    beforeEach(() => {
      mockFs({
        'dir/file.txt': 'some text ...',
        'dev/file.txt': ''
      });
    });

    afterEach(() => {
      mockFs.restore();
    });

    it('Must create a symbolic link', async () => {
      await pfs.symlink('./dir/file.txt', './dir/link.txt');
      const stat = await pfs.stat('./dir/link.txt');

      assert(stat.isSymbolicLink());
    });

    it(`Must create a symbolic link in 'sync' mode`, async () => {
      pfs.symlink('./dir/file.txt', './dir/link.txt', {
        sync: true
      });

      const stat = await pfs.stat('./dir/link.txt');
      assert(stat.isSymbolicLink());
    });

    it('To a non-existent resource to return an Error', async () => {
      try {
        await pfs.symlink('./dev/file.txt', './dir/file.txt');
      }
      catch (err) {
        const index = err.message.indexOf('EEXIST, file already exists');
        assert(index > -1);
      }
    });
  });
});
