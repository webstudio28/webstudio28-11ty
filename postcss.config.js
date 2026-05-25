/**
 * PostCSS pipeline for the Web Studio 28 stylesheet bundle.
 *
 * Order:
 *   1. postcss-import → inlines every `@import` (turns 21+ blocking
 *      requests into a single file).
 *   2. tailwindcss    → expands `@tailwind` directives + `@apply`.
 *   3. autoprefixer   → adds vendor prefixes per browserslist.
 *   4. cssnano        → minifies the final stylesheet.
 */
module.exports = {
  plugins: [
    require("postcss-import"),
    require("tailwindcss"),
    require("autoprefixer"),
    require("cssnano")({ preset: "default" }),
  ],
};
