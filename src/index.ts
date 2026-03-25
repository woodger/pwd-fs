import { PoweredFileSystem } from './powered-file-system';

/**
 * Default file system instance rooted at the current working directory.
 */
export const pfs = new PoweredFileSystem();
export default PoweredFileSystem;
export * from './powered-file-system';
