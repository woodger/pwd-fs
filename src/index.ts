import { PoweredFileSystem } from './powered-file-system';

/**
 * Default file system instance using the current working directory as its base.
 */
export const pfs = new PoweredFileSystem();
export default PoweredFileSystem;
export * from './powered-file-system';
