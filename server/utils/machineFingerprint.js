const os = require("os");
const crypto = require("crypto");
const { execFileSync } = require("child_process");

const MACHINE_SALT = process.env.APP_MACHINE_SALT || "POCKETCHALLAN_MACHINE_SALT_V1";

function getWindowsUuid() {
  try {
    const output = execFileSync(
      "powershell",
      [
        "-NoProfile",
        "-Command",
        "(Get-CimInstance -ClassName Win32_ComputerSystemProduct).UUID"
      ],
      { encoding: "utf8" }
    );
    return String(output || "").trim();
  } catch (error) {
    return "";
  }
}

function getMachineId() {
  if (process.platform === "win32") {
    const uuid = getWindowsUuid();
    if (uuid) {
      return uuid;
    }
  }

  const user = (() => {
    try {
      return os.userInfo().username || "";
    } catch (error) {
      return "";
    }
  })();

  return [os.hostname(), os.platform(), os.arch(), user].join("|");
}

function getMachineHash() {
  const machineId = getMachineId();
  return crypto.createHmac("sha256", MACHINE_SALT).update(machineId).digest("hex");
}

module.exports = {
  getMachineHash
};
