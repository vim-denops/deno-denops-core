# 🪐 denops_core

[![test](https://github.com/vim-denops/deno-denops/workflows/test/badge.svg)](https://github.com/vim-denops/deno-denops/actions?query=workflow%3Atest)
[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/denops_core/mod.ts)
[![deno land](http://img.shields.io/badge/available%20on-deno.land/x/denops__core-lightgrey.svg?logo=deno)](https://deno.land/x/denops_core)

This module is a fundamental component of [denops.vim], an ecosystem for
crafting plugins in [Deno] for Vim/Neovim.

It's essential to highlight that the recommended practice for most users is to
utilize the [denops_std] module when developing plugins for [denops.vim]. The
current module is structured as a foundational layer within [denops_std], and
utilizing it directly from plugins is **strongly discouraged**.

[deno]: https://deno.land/
[denops.vim]: https://github.com/vim-denops/denops.vim
[denops_std]: https://deno.land/x/denops_std
