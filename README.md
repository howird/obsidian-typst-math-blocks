# Typst Math Blocks

- the most simple possible obsidian plugin which just converts `typst` math into
  `latex` before rendering
- this plugin also fixes
  [this long-standing issue](https://forum.obsidian.md/t/latex-math-newline-line-break/13321)
  of MathJax not being able to render latex newlines with
  [this solution](https://github.com/mathjax/MathJax/issues/2312#issuecomment-538185951)
  - note: this fix is only applied to the `typst` math after it is converted

## Alternatives

- [obsidian-wypst](https://github.com/0xbolt/obsidian-wypst): worked great for
  me, except for the major drawback of
  [accents not working](https://github.com/0xbolt/wypst/issues/6)
- [obsidian-typst](https://github.com/fenjalien/obsidian-typst): is okay, but
  renders to SVG, which led to some ugly rendering on my machine
