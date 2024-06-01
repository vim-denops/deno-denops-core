/**
 * API dispatcher
 */
export type Dispatcher = {
  [key: string]: (...args: unknown[]) => unknown;
};

/**
 * Context that expands into the local namespace (l:)
 */
export type Context = Record<string, unknown>;

/**
 * Environment meta information.
 */
export interface Meta {
  /**
   * Current denops mode.
   * In "debug" or "test" mode, some features become enabled,
   * which might impact performance.
   */
  readonly mode: "release" | "debug" | "test";
  /**
   * Host program.
   */
  readonly host: "vim" | "nvim";
  /**
   * Host program version.
   */
  readonly version: string;
  /**
   * Host platform name.
   */
  readonly platform: "windows" | "mac" | "linux";
}

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

/**
 * Denops is a facade instance visible from each denops plugin.
 */
export interface Denops {
  /**
   * Denops instance name used to communicate with Vim.
   */
  readonly name: string;

  /**
   * Environment meta information.
   */
  readonly meta: Meta;

  /**
   * Context object for plugins.
   */
  readonly context: Record<PropertyKey, unknown>;

  /**
   * AbortSignal instance that is triggered when the user invoke `denops#interrupt()`
   */
  readonly interrupted: AbortSignal;

  /**
   * User-defined API name and method map used to dispatch API requests.
   */
  dispatcher: Dispatcher;

  /**
   * Redraw text and cursor on Vim.
   *
   * It is not equivalent to the `redraw` command in Vim script and does nothing on Neovim.
   * Use `denops.cmd('redraw')` instead if you need to execute the `redraw` command.
   *
   * @param force: Clear the screen prior to redraw.
   */
  redraw(force?: boolean): Promise<void>;

  /**
   * Call an arbitrary function of Vim/Neovim and return the result.
   *
   * @param fn: A function name of Vim/Neovim.
   * @param args: Arguments of the function.
   *
   * Note that arguments after `undefined` in `args` will be dropped for convenience.
   */
  call(fn: string, ...args: unknown[]): Promise<unknown>;

  /**
   * Call arbitrary functions of Vim/Neovim sequentially without redraw and
   * return the results.
   *
   * It throws a BatchError when one of the functions fails. The `results` attribute
   * of the error instance holds succeeded results of functions prior to the
   * error.
   *
   * @param calls: A list of tuples ([fn, args]) to call Vim/Neovim functions.
   *
   * Note that arguments after `undefined` in `args` will be dropped for convenience.
   */
  batch(...calls: [string, ...unknown[]][]): Promise<unknown[]>;

  /**
   * Execute an arbitrary command of Vim/Neovim under a given context.
   *
   * @param cmd: A command expression to be executed.
   * @param ctx: A context object that expands into the local namespace (l:)
   */
  cmd(cmd: string, ctx?: Context): Promise<void>;

  /**
   * Evaluate an arbitrary expression of Vim/Neovim under a given context and return the result.
   *
   * @param expr: An expression to be evaluated.
   * @param ctx: A context object that expands into the local namespace (l:)
   */
  eval(expr: string, ctx?: Context): Promise<unknown>;

  /**
   * Dispatch an arbitrary function of an arbitrary plugin and return the result.
   *
   * @param name: A plugin registration name.
   * @param fn: A function name in the API registration.
   * @param args: Arguments of the function.
   */
  dispatch(name: string, fn: string, ...args: unknown[]): Promise<unknown>;
}

/**
 * Denops's entrypoint definition.
 *
 * Use this type to ensure the `main` function is properly implemented like
 *
 * ```ts
 * import type { Entrypoint } from "https://deno.land/x/denops_core@$MODULE_VERSION/mod.ts";
 *
 * export const main: Entrypoint = (denops) => {
 *   // ...
 * }
 * ```
 */
export type Entrypoint = (denops: Denops) => void | Promise<void>;
