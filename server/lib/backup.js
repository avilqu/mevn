#!/usr/bin/env node

require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env"),
});
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const BACKUP_DIR = path.join(os.homedir(), "backup");
const DB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

function createBackup() {
  const timestamp = new Date().toISOString().split("T")[0];
  const backupPath = path.join(BACKUP_DIR, timestamp);
  const command = `mongodump --uri="${DB_URI}" --out="${backupPath}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Backup failed: ${error}`);
      process.exit(1);
    }
    console.log(`Backup created successfully at ${backupPath}`);
    cleanupOldBackups();
  });
}

function cleanupOldBackups() {
  const files = fs.readdirSync(BACKUP_DIR);
  const now = new Date();

  files.forEach((file) => {
    // Skip Syncthing folder marker
    if (file === ".stfolder") {
      return;
    }

    const filePath = path.join(BACKUP_DIR, file);
    const stats = fs.statSync(filePath);
    const daysOld = (now - stats.mtime) / (1000 * 60 * 60 * 24);

    if (daysOld > 7) {
      fs.rmSync(filePath, { recursive: true, force: true });
      console.log(`Deleted old backup: ${file}`);
    }
  });
}

if (require.main === module) {
  createBackup();
}

module.exports = {
  createBackup,
  cleanupOldBackups,
};
