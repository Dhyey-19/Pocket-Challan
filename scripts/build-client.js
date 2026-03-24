const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const bytenode = require("bytenode");

const projectRoot = path.resolve(__dirname, "..");
const outDir = path.join(projectRoot, "dist", "PocketChallan-Client");
const zipPath = path.join(projectRoot, "dist", "PocketChallan-Client.zip");

function removeIfExists(targetPath) {
  if (fs.existsSync(targetPath)) {
    fs.rmSync(targetPath, { recursive: true, force: true });
  }
}

function ensureDir(targetPath) {
  fs.mkdirSync(targetPath, { recursive: true });
}

function walkJsFiles(dirPath, collector = []) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      walkJsFiles(fullPath, collector);
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".js")) {
      collector.push(fullPath);
    }
  }
  return collector;
}

function toRelativePosix(base, target) {
  return path.relative(base, target).split(path.sep).join("/");
}

function compileServerCode() {
  const filesToCompile = [
    path.join(projectRoot, "server.js"),
    ...walkJsFiles(path.join(projectRoot, "server"))
  ];

  for (const sourceFile of filesToCompile) {
    const relativeFile = path.relative(projectRoot, sourceFile);
    const outputJs = path.join(outDir, relativeFile);
    const outputJsc = outputJs.replace(/\.js$/i, ".jsc");

    ensureDir(path.dirname(outputJs));

    bytenode.compileFile({
      filename: sourceFile,
      output: outputJsc
    });

    const outputJscName = `./${path.basename(outputJsc)}`;
    let wrapperContent = "require(\"bytenode\");\n";

    if (relativeFile === "server.js") {
      wrapperContent += `require(${JSON.stringify(outputJscName)});\n`;
    } else {
      wrapperContent += `module.exports = require(${JSON.stringify(outputJscName)});\n`;
    }

    fs.writeFileSync(outputJs, wrapperContent, "utf8");
  }
}

function copyRuntimeFiles() {
  ensureDir(outDir);

  execSync("node scripts/build-public.js", {
    cwd: projectRoot,
    stdio: "inherit"
  });

  const nodeExeSource = process.execPath;
  const nodeExeTarget = path.join(outDir, "node.exe");
  fs.copyFileSync(nodeExeSource, nodeExeTarget);

  const nodeModulesSrc = path.join(projectRoot, "node_modules");
  if (!fs.existsSync(nodeModulesSrc)) {
    throw new Error("node_modules not found. Run npm install first.");
  }
  fs.cpSync(nodeModulesSrc, path.join(outDir, "node_modules"), {
    recursive: true
  });

  const publicSrc = path.join(projectRoot, "public");
  if (fs.existsSync(publicSrc)) {
    const publicDest = path.join(outDir, "public");
    ensureDir(publicDest);
    ["index.html", "styles.css", "app.bundle.js"].forEach((file) => {
      const srcFile = path.join(publicSrc, file);
      if (fs.existsSync(srcFile)) {
        fs.copyFileSync(srcFile, path.join(publicDest, file));
      }
    });
  }

  const dataSrc = path.join(projectRoot, "data");
  if (fs.existsSync(dataSrc)) {
    fs.cpSync(dataSrc, path.join(outDir, "data"), { recursive: true });
  } else {
    ensureDir(path.join(outDir, "data"));
  }
}

function writeLauncherFiles() {
  const batContent = [
    "@echo off",
    "cd /d %~dp0",
    "start \"\" http://localhost:3000",
    "node.exe server.js"
  ].join("\r\n");

  fs.writeFileSync(path.join(outDir, "Start-PocketChallan.bat"), batContent, "utf8");

  const readmeContent = [
    "Pocket Challan - Client Package",
    "",
    "How to run:",
    "1. Extract this ZIP.",
    "2. Double-click Start-PocketChallan.bat.",
    "3. Keep the terminal window open while using the app.",
    "",
    "Notes:",
    "- No Node.js or npm installation is required on client machine.",
    "- Backend source is distributed as bytecode (.jsc), not full .js source.",
    "- App URL: http://localhost:3000"
  ].join("\r\n");

  fs.writeFileSync(path.join(outDir, "README_CLIENT.txt"), readmeContent, "utf8");
}

function createZip() {
  removeIfExists(zipPath);
  const escapedOut = toRelativePosix(projectRoot, outDir);
  const escapedZip = toRelativePosix(projectRoot, zipPath);

  const command = [
    "powershell",
    "-NoProfile",
    "-ExecutionPolicy",
    "Bypass",
    "-Command",
    `\"Compress-Archive -Path '${escapedOut}\\*' -DestinationPath '${escapedZip}' -Force\"`
  ].join(" ");

  execSync(command, {
    cwd: projectRoot,
    stdio: "inherit"
  });
}

function main() {
  removeIfExists(outDir);
  ensureDir(outDir);

  copyRuntimeFiles();
  compileServerCode();
  writeLauncherFiles();
  createZip();

  console.log("\nClient build generated:");
  console.log(path.relative(projectRoot, outDir));
  console.log(path.relative(projectRoot, zipPath));
}

main();
