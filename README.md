# 🪐 denops_core

[![JSR](https://jsr.io/badges/@denops/core)](https://jsr.io/@denops/core)
[![test](https://github.com/vim-denops/deno-denops/workflows/test/badge.svg)](https://github.com/vim-denops/deno-denops/actions?query=workflow%3Atest)

This is a core module of [denops.vim], an ecosystem for creating Vim/Neovim
plugin in [Deno].

> [!WARNING]
>
> This module is mainly for internal use. It's **strongly discouraged** to
> utilize this module directly from plugins. Use the [@denops/std] module
> instead.

```ts
import type { Entrypoint } from "jsr:@denops/core";

export const main: Entrypoint = (denops) => {
  // ...
};
```

[deno]: https://deno.land/
[denops.vim]: https://github.com/vim-denops/denops.vim
[@denops/std]: https://jsr.io/@denops/std

# License

The code follows the MIT license, as stated in [LICENSE](./LICENSE).
Contributors need to agree that any modifications sent to this repository follow
the license.
