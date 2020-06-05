const os = require('os');
const assert = require('assert');
const mockFs = require('mock-fs');
const PoweredFileSystem = require('..');

describe('pfs.mkdir(src [, options])', () => {
  const pfs = new PoweredFileSystem();

  describe('Interface', () => {
    it('Throw an exception if the option argument is not a object', async () => {
      try {
        await pfs.mkdir('./dir', null);
      }
      catch (err) {
        assert(err instanceof TypeError);
      }
    });

    const options = {
      umask: Number,
      resolve: Boolean,
      sync: Boolean
    };

    for (let i of Object.keys(options)) {
      const {name} = options[i];

      it(`Throw an exception if '${i}' value is not a ${name}`, async () => {
        try {
          await pfs.mkdir('./dir', {
            [i]: null
          });
        }
        catch (err) {
          assert(
            err.message ===
            `Invalid value '${i}' in order '#mkdir()'. Expected ${name}`
          );
        }
      });
    }
  });

  describe('File system access', () => {
    beforeEach(() => {
      mockFs({
        'dir/file.txt': 'some text ...'
      });
    });

    afterEach(() => {
      mockFs.restore();
    });

    it('Create directories in the working directory', async () => {
      await pfs.mkdir('./dir/041ab08b');
      const exist = await pfs.test('./dir/041ab08b');

      assert(exist);
    });

    it(`Create directories in the working directory in 'sync' mode`, async () => {
      pfs.mkdir('./dir/041ab08b', {
        sync: true
      });

      const exist = await pfs.test('./dir/041ab08b');
      assert(exist);
    });

    it('Should work fine with the existing directory', async () => {
      await pfs.mkdir('./dir/041ab08b');
      await pfs.mkdir('./dir/041ab08b');

      const exist = await pfs.test('./dir/041ab08b');
      assert(exist);
    });

    it(`Should work fine with the existing directory in 'sync' mode`, async () => {
      pfs.mkdir('./dir/041ab08b', {
        sync: true
      });

      pfs.mkdir('./dir/041ab08b', {
        sync: true
      });

      const exist = await pfs.test('./dir/041ab08b');
      assert(exist);
    });

    it('Test optimization of the current working directory', async () => {
      await pfs.mkdir('.');
    });

    it(`Create directories in the 'root' directory`, async () => {
      const root = os.tmpdir();
      const now = Date.now();
      const src = `${root}/tmp.${now}`;

      await pfs.mkdir(src);
      const exists = await pfs.test(src);

      assert(exists === true);
    });

    it('Throw an exception if trying to create a directory in file', async () => {
      try {
        await pfs.mkdir('./dir/file.txt/non-existent');
      }
      catch (err) {
        assert(err.message);
      }
    });

    it(`Throw an exception if trying to create a directory in file in 'sync' mode`, () => {
      try {
        pfs.mkdir('./dir/file.txt/non-existent', {
          sync: true
        });
      }
      catch (err) {
        assert(err.message);
      }
    });
  });
});
