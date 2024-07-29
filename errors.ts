/**
 * This module provides error classes for [denops.vim].
 *
 * [denops.vim]: https://github.com/vim-denops/denops.vim
 *
 * @module
 */

/**
 * Batch error raised when one of the functions fails during batch process.
 */
export class BatchError extends Error {
  /**
   * A result list that is successfully completed prior to the error.
   */
  readonly results: unknown[];

  constructor(message: string, results: unknown[]) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BatchError);
    }

    this.name = this.constructor.name;
    this.results = results;
  }
}
