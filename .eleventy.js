module.exports = function (eleventyConfig) {
  // Pass through images and JS as-is.
  eleventyConfig.addPassthroughCopy({ "src/assets/images": "assets/images" });
  eleventyConfig.addPassthroughCopy({ "src/assets/js": "assets/js" });

  // Only ship the single bundled stylesheet — not the individual source CSS
  // files that get inlined into it by PostCSS.
  eleventyConfig.addPassthroughCopy({
    "src/assets/css/main.bundle.css": "assets/css/main.bundle.css",
  });

  eleventyConfig.addPassthroughCopy({ "src/favicon.png": "favicon.png" });

  eleventyConfig.addGlobalData("buildDate", () =>
    new Date().toISOString().slice(0, 10)
  );

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data",
    },
    templateFormats: ["njk", "html", "md"],
    htmlTemplateEngine: "njk",
  };
};
