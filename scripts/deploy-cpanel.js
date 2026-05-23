/**
 * Build for cPanel (no path prefix — same as CI).
 * Upload the contents of _site/ to your cPanel "webstudio28-11ty" folder so that
 * folder is the document root (e.g. addon domain pointing there).
 */

const { execSync } = require("child_process");
const path = require("path");

console.log("Building for cPanel (no path prefix)...\n");

try {
  execSync("npm run build", {
    stdio: "inherit",
    cwd: path.resolve(__dirname, ".."),
  });
  console.log("\nBuild complete.");
  console.log("Upload the contents of _site/ to your cPanel webstudio28-11ty folder (document root).\n");
} catch (err) {
  process.exit(err.status || 1);
}
