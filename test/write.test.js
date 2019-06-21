const assert = require('assert');
const mockFs = require('mock-fs');
const PoweredFileSystem = require('..');

describe('pfs.write(src, data[, options])', () => {
  const pfs = new PoweredFileSystem();
  const content = 'more text ...';

  describe('Interface', () => {
    it('Throw an exception if the option argument is not a object', async () => {
      try {
        await pfs.write('./dir/file.txt', content, null);
      }
      catch (err) {
        assert(
          err.message ===
          "Cannot destructure property `encoding` of 'undefined' or 'null'."
        );
      }
    });

    it('An unknown flag should throw an exception', async () => {
      try {
        await pfs.test('./dir/file.txt', {
          flag: 'u'
        });
      }
      catch (err) {
        assert(err.message === "Unknown file test flag: u");
      }
    });

    const options = {
      encoding: String,
      umask: Number,
      flag: String,
      resolve: Boolean,
      sync: Boolean
    };

    for (let i of Object.keys(options)) {
      const {name} = options[i];

      it(`Throw an exception if '${i}' value is not a ${name}`, async () => {
        try {
          await pfs.write('./file.txt', content, {
            [i]: null
          });
        }
        catch (err) {
          assert(
            err.message ===
            `Invalid value '${i}' in order '#write()'. Expected ${name}`
          );
        }
      });
    }
  });

  describe('File system access', () => {
    beforeEach(() => {
      mockFs({
        dir: mockFs.directory({})
      });
    });

    afterEach(() => {
      mockFs.restore();
    });

    it('Must write content to file', async () => {
      await pfs.write('./dir/file.txt', content);
      const stat = await pfs.stat('./dir/file.txt');

      assert(stat.size === 13);
    });

    it(`Must write content to file in 'sync' mode`, async () => {
      pfs.write('./dir/file.txt', content, {
        sync: true
      });

      const stat = await pfs.stat('./dir/file.txt');
      assert(stat.size === 13);
    });

    it(`Unexpected option 'flag' returns Error`, async () => {
      try {
        await pfs.write('./dir/flagr.txt', content, {
          flag: 'r'
        });
      }
      catch (err) {
        const index = err.message.indexOf('ENOENT, no such file or directory');
        assert(index > -1);
      }
    });
  });
});
