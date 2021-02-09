const assert = require('assert');
const mockFs = require('mock-fs');
const PoweredFileSystem = require('../dist');

describe('pfs.remove(src [, options])', () => {
  const pfs = new PoweredFileSystem();

  describe('Interface', () => {
    it('Throw an exception if the option argument is not a object', async () => {
      try {
        await pfs.remove('./dir/file.txt', null);
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
          await pfs.remove('./dir/file.txt', {
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
        dir: {
          dir: mockFs.directory(),
          'file.txt': ''
        },
        dev: mockFs.directory({
          mode: 0004,
          items: {
            'mock.txt': '',
            'file.txt': ''
          }
        }),
      });
    });

    afterEach(() => {
      mockFs.restore();
    });

    it('Removal a directory with a file', async () => {
      await pfs.remove('./dir');
      const exist = await pfs.test('./dir');

      assert(exist === false);
    });

    it(`Removal a directory with a file in 'sync' mode`, async () => {
      pfs.remove('./dir', {
        sync: true
      });

      const exist = await pfs.test('./dir');
      assert(exist === false);
    });

    it('Search permission is denied on a component of the path prefix', async () => {
      try {
        await pfs.remove('./dev');
      }
      catch (err) {
        const index = err.message.indexOf('EACCES, permission denied');
        assert(index > -1);
      }
    });

    it('To a non-existent resource to return an Error', async () => {
      try {
        await pfs.remove('./non-existent.txt');
      }
      catch (err) {
        const index = err.message.indexOf('ENOENT, no such file or directory');
        assert(index > -1);
      }
    });
  });
});
