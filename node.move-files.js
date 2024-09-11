import fs from "fs-extra";
import * as path from "path";

const __dirname = fs.realpathSync(process.cwd());
const sourceDir = path.resolve(__dirname, "dist/esm/main.js");
const destDir = path.resolve(__dirname, "public", "scripts/dcr.js");

fs.copy(sourceDir, destDir, (err) => {
  if (err) return console.error(err);
  console.log("Files moved successfully!");
});
