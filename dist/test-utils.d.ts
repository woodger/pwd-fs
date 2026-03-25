/**
 * Lightweight in-memory-like description of a temporary file system tree.
 */
export interface Iframe {
    [key: string]: any;
}
/**
 * Creates an isolated temporary directory for a single test case.
 */
export declare function createTmpDir(): string;
/**
 * Materializes a test fixture tree on disk from a declarative frame description.
 */
export declare function fmock(frame: Iframe): void;
/**
 * Removes the temporary fixture tree while resetting restrictive permissions first.
 */
export declare function restore(tmpDir: string): void;
