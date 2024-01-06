/**
 * Denops option object that is passed as a second argument of `main` function.
 */
export interface DenopsOptions {
  /**
   * Return a promise that resolves when the `denops#interrupt()` function is called.
   *
   * If `signal` is given, the promise will be rejected when the signal is aborted.
   */
  interrupted({ signal }?: { signal?: AbortSignal }): Promise<void>;
}
