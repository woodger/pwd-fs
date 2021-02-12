import assert from 'assert';
import mockFs from 'mock-fs';
import Chance  from 'chance';
import PoweredFileSystem from '../src';

describe('test(src[, options])', () => {
  beforeEach(() => {
    const chance = new Chance();

    mockFs({
      'tmpdir': {
        'binapp': chance.paragraph(),
        'libxbase': mockFs.directory()
      }
    });
  });

  afterEach(mockFs.restore);

  it(`Positive: Should return 'true' for current working directory`, async () => {
    const pfs = new PoweredFileSystem();

    const exist = await pfs.test('.');
    assert(exist);
  });

  it(`Positive: For existing directory should return 'true'`, async () =>  {
    const pfs = new PoweredFileSystem();

    const exist = await pfs.test('./tmpdir/libxbase');
    assert(exist);
  });

  it(`Positive: For existing directory should return 'true' in 'sync' mode`, () =>  {
    const pfs = new PoweredFileSystem();

    const exist = pfs.test('./tmpdir/libxbase', {
      sync: true
    });

    assert(exist);
  });

  it(`Positive: For existing file should return 'true'`, async () => {
    const pfs = new PoweredFileSystem();

    const exist = await pfs.test('./tmpdir/binapp');
    assert(exist);
  });

  it(`Positive: For existing file should return 'true' in 'sync' mode`, () =>  {
    const pfs = new PoweredFileSystem();

    const exist = pfs.test('./tmpdir/binapp', {
      sync: true
    });

    assert(exist);
  });

  it(`Positive: A non-existent file must return 'false'`, async () => {
    const pfs = new PoweredFileSystem();
    const chance = new Chance();

    const base = chance.guid();
    const exists = await pfs.test(`./${base}`);

    assert(exists === false);
  });

  it(`Positive: A non-existent file must return 'false' in 'sync' mode`, async () => {
    const pfs = new PoweredFileSystem();
    const chance = new Chance();

    const base = chance.guid();
    const exists = pfs.test(`./${base}`, {
      sync: true
    });

    assert(exists === false);
  });
});
