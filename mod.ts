/**
 * This is a core module of [denops.vim], an ecosystem for creating Vim/Neovim
 * plugin in [Deno].
 *
 * > [!WARNING]
 * >
 * > This module is mainly for internal use. It's **strongly discouraged** to
 * > utilize this module directly from plugins. Use the [@denops/std] module
 * > instead.
 *
 * ```ts
 * import type { Entrypoint } from "jsr:@denops/core";
 *
 * export const main: Entrypoint = (denops) => {
 *     // ...
 * };
 * ```
 *
 * [deno]: https://deno.land/
 * [denops.vim]: https://github.com/vim-denops/denops.vim
 * [@denops/std]: https://jsr.io/@denops/std
 *
 * @module
 */

export * from "./error.ts";
export type * from "./type.ts";
