const fs = require("fs");
const path = require("path");
const bindings = require("bindings");

const getExternalBindingPath = () => {
  if (!process.pkg) {
    return null;
  }
  const exeDir = path.dirname(process.execPath);
  return path.join(exeDir, "node_sqlite3.node");
};

const externalBinding = getExternalBindingPath();
if (externalBinding && fs.existsSync(externalBinding)) {
  module.exports = require(externalBinding);
} else {
  module.exports = bindings("node_sqlite3.node");
}
