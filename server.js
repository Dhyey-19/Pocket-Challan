const express = require("express");
const path = require("path");
const { exec } = require("child_process");

const { initDb } = require("./server/db");
const apiRoutes = require("./server/routes");

const app = express();
const port = process.env.PORT || 3000;

const publicDir = process.pkg
  ? path.join(path.dirname(process.execPath), "public")
  : path.join(__dirname, "public");

initDb();

app.use(express.json({ limit: "10mb" }));
app.use(express.static(publicDir));

apiRoutes.forEach((router) => app.use("/api", router));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", (req, res) => {
  res.status(404).json({ error: "API route not found." });
});

const openBrowser = (url) => {
  if (process.env.NO_BROWSER === "1") {
    return;
  }
  const command =
    process.platform === "win32"
      ? `start "" "${url}"`
      : process.platform === "darwin"
        ? `open "${url}"`
        : `xdg-open "${url}"`;
  exec(command, (error) => {
    if (error) {
      console.error("Unable to open browser.", error);
    }
  });
};

app.listen(port, () => {
  const url = `http://localhost:${port}`;
  console.log(`Server running at ${url}`);
  openBrowser(url);
});
