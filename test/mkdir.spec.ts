import assert from 'assert';
import os from 'os';
import mockFs from 'mock-fs';
import Chance  from 'chance';
import FileSystem from '../src';

describe('mkdir(src [, options])', () => {
  beforeEach(() => {
    const chance = new Chance();

    mockFs({
      'tmpdir': {
        'binapp': chance.paragraph(),
        'libxbase': mockFs.directory()
      },
    });
  });

  afterEach(mockFs.restore);

  it('Positive: Create directories in the working directory', async () => {
    const pfs = new FileSystem();
    const chance = new Chance();

    const base = chance.guid();
    await pfs.mkdir(`./tmpdir/${base}`);

    const exist = await pfs.test(`./tmpdir/${base}`);

    assert(exist);
  });

  it(`Positive: Make current directory`, async () => {
    const pfs = new FileSystem('./tmpdir');

    await pfs.mkdir('.');
    const exist = await pfs.test('.');

    assert(exist);
  });

  it(`Positive: Make current directory in 'sync' mode`, async () => {
    const pfs = new FileSystem('./tmpdir');

    pfs.mkdir('.', {
      sync: true
    });

    const exist = await pfs.test('.');

    assert(exist);
  });

  it('Positive: Should work fine with the existing directory', async () => {
    const pfs = new FileSystem();
    const chance = new Chance();

    const base = chance.guid();

    for (const item of [base, base]) {
      await pfs.mkdir(`./tmpdir/${item}`);

      const exist = await pfs.test(`./tmpdir/${item}`);

      assert(exist);
    }
  });

  it(`Positive: Should work fine with the existing directory in 'sync' mode`, async () => {
    const pfs = new FileSystem();
    const chance = new Chance();

    const base = chance.guid();

    for (const item of [base, base]) {
      pfs.mkdir(`./tmpdir/${item}`, {
        sync: true
      });

      const exist = await pfs.test(`./tmpdir/${item}`);

      assert(exist);
    }
  });

  it('Negative: Throw an exception if trying to create a directory in file', async () => {
    const pfs = new FileSystem();
    const chance = new Chance();

    const base = chance.guid();

    try {
      await pfs.mkdir(`./tmpdir/binapp/${base}`);
    }
    catch ({ errno }) {
      assert(errno === -20);
    }
  });

  it(`Negative: Throw an exception if trying to create a directory in file in 'sync' mode`, async () => {
    const pfs = new FileSystem();
    const chance = new Chance();

    const base = chance.guid();

    try {
      pfs.mkdir(`./tmpdir/binapp/${base}`, {
        sync: true
      });
    }
    catch ({ errno }) {
      assert(errno === -20);
    }
  });
});
