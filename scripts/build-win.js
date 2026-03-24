const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");

if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}

fs.mkdirSync(distDir, { recursive: true });

execSync("node scripts/build-public.js", {
  cwd: root,
  stdio: "inherit"
});

const sqliteBindingTarget = path.join(
  root,
  "node_modules",
  "sqlite3",
  "lib",
  "sqlite3-binding.js"
);
const sqliteBindingSource = path.join(root, "scripts", "sqlite3-binding-pkg.js");

if (!fs.existsSync(sqliteBindingTarget)) {
  throw new Error("sqlite3-binding.js not found. Run npm install first.");
}

fs.copyFileSync(sqliteBindingSource, sqliteBindingTarget);

execSync("npx pkg . --targets node18-win-x64 --output dist/PocketChallan.exe", {
  stdio: "inherit"
});

const publicSource = path.join(root, "public");
const publicDest = path.join(distDir, "public");
fs.mkdirSync(publicDest, { recursive: true });
["index.html", "styles.css", "app.bundle.js"].forEach((file) => {
  const srcFile = path.join(publicSource, file);
  if (fs.existsSync(srcFile)) {
    fs.copyFileSync(srcFile, path.join(publicDest, file));
  }
});

const bindingCandidates = [
  path.join(root, "node_modules", "sqlite3", "build", "Release", "node_sqlite3.node"),
  path.join(
    root,
    "node_modules",
    "sqlite3",
    "lib",
    "binding",
    "node-v108-win32-x64",
    "node_sqlite3.node"
  )
];

const bindingSource = bindingCandidates.find((candidate) => fs.existsSync(candidate));
const bindingDest = path.join(distDir, "node_sqlite3.node");

if (!bindingSource) {
  throw new Error("sqlite3 binding not found in build/Release or lib/binding.");
}

fs.copyFileSync(bindingSource, bindingDest);
console.log("Copied sqlite3 binding to dist.");
