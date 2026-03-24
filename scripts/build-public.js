const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");
const outFile = path.join(publicDir, "app.bundle.js");

const sources = [
  path.join(publicDir, "app", "utils.js"),
  path.join(publicDir, "app", "constants.js"),
  path.join(publicDir, "app", "components.js"),
  path.join(publicDir, "app.js")
];

async function build() {
  const combined = sources.map((file) => fs.readFileSync(file, "utf8")).join("\n");
  const result = await esbuild.transform(combined, {
    loader: "jsx",
    minify: true,
    target: "es2018"
  });
  fs.writeFileSync(outFile, result.code, "utf8");
  console.log("Generated", path.relative(root, outFile));
}

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
