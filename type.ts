/**
 * This module provides type interfaces for [denops.vim].
 *
 * [denops.vim]: https://github.com/vim-denops/denops.vim
 *
 * @module
 */

/**
 * API dispatcher that maps method names to functions.
 *
 * Each method must accept `unknown[]` arguments and return `unknown`.
 * Use type validation libraries like [jsr:@core/unknownutil] to properly
 * validate and narrow argument types at runtime.
 *
 * [jsr:@core/unknownutil]: https://jsr.io/@core/unknownutil
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
   *
   * @deprecate All plugins should manage their state by themselves and use `denops.dispatch` to communicate with other denops plugins directly.
   */
  readonly context: Record<PropertyKey, unknown>;

  /**
   * AbortSignal instance that is triggered when the user invoke `denops#interrupt()`
   */
  readonly interrupted?: AbortSignal;

  /**
   * User-defined API name and method map used to dispatch API requests.
   *
   * Each method must accept `unknown[]` arguments and return `unknown` values.
   * Use type validation libraries like [jsr:@core/unknownutil] to validate
   * argument types at runtime. These methods can be called from other plugins
   * using `denops.dispatch()`.
   *
   * [jsr:@core/unknownutil]: https://jsr.io/@core/unknownutil
   *
   * @example
   * ```ts
   * import { is, assert } from "jsr:@core/unknownutil";
   *
   * denops.dispatcher = {
   *   "hello": (name: unknown) => {
   *     assert(name, is.String);
   *     return `Hello, ${name}!`;
   *   },
   *   "add": (a: unknown, b: unknown) => {
   *     assert(a, is.Number);
   *     assert(b, is.Number);
   *     return a + b;
   *   },
   *   "fetchData": async (id: unknown) => {
   *     assert(id, is.String);
   *     return await fetch(`/api/data/${id}`);
   *   },
   * };
   * ```
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
   * @param name A plugin registration name.
   * @param fn A function name in the dispatcher of the target plugin.
   * @param args Arguments to pass to the function. Arguments are passed as `unknown` types.
   * @returns A Promise that resolves to the return value of the dispatched function.
   *          The return type is `unknown` and should be validated if needed.
   *
   * @example
   * ```ts
   * import { is } from "jsr:@core/unknownutil";
   *
   * // Call method and validate return type
   * const result = await denops.dispatch("myPlugin", "hello", "world");
   * if (is.String(result)) {
   *   console.log(`Greeting: ${result}`);
   * }
   *
   * // Call method with multiple arguments
   * const sum = await denops.dispatch("calculator", "add", 5, 3);
   * if (is.Number(sum)) {
   *   console.log(`Sum: ${sum}`);
   * }
   * ```
   */
  dispatch(name: string, fn: string, ...args: unknown[]): Promise<unknown>;
}

/**
 * Denops's entrypoint definition.
 *
 * Use this type to ensure the `main` function is properly implemented like:
 *
 * ```ts
 * import type { Entrypoint } from "jsr:@denops/core";
 *
 * export const main: Entrypoint = (denops) => {
 *   // ...
 * }
 * ```
 *
 * If an `AsyncDisposable` object is returned, resources can be disposed of
 * asynchronously when the plugin is unloaded, like:
 *
 * ```ts
 * import type { Entrypoint } from "jsr:@denops/core";
 *
 * export const main: Entrypoint = (denops) => {
 *   // ...
 *   return {
 *     [Symbol.asyncDispose]: async () => {
 *       // Dispose resources...
 *     }
 *   }
 * }
 * ```
 */
export type Entrypoint = (
  denops: Denops,
) => void | AsyncDisposable | Promise<void | AsyncDisposable>;
