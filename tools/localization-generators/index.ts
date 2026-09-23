/// <reference types="node" />
import fs from "fs/promises";
import path from "path";
import os from "os";
import child_process from "child_process";
import { promisify } from "util";

const csDisplayNamesFilePath = path.join(__dirname, "..", "..", "backend", "Core", "Common", "Localization", "DisplayNames.cs");
const tsDisplayNameFilePath = path.join(__dirname, "..", "..", "frontend", "src", "localization", "generated", "displayNames.ts");

const csDisplayNamesContent = await fs.readFile(csDisplayNamesFilePath, { encoding: "utf-8" });
const pattern = /public const string (?<name>[A-Z][a-zA-Z0-9]+) = "(?<value>.+)";/;
let tsDisplayNamesContent = "";
for (const line of csDisplayNamesContent.split(os.EOL)) {
  const match = line.match(pattern);
  if (match && match.groups) {
    const { name, value } = match.groups;
    const loweredName = name[0].toLowerCase() + name.slice(1);
    tsDisplayNamesContent += `${loweredName}: "${value}",${os.EOL}`;
  }
}

tsDisplayNamesContent = `
export const displayNames = {
  ${tsDisplayNamesContent}
}
`.trim();;

const tempFilePath = path.join(__dirname, "temp.ts");
await fs.writeFile(tempFilePath, tsDisplayNamesContent);

const execAsync = promisify(child_process.exec);
await execAsync(`pnpm exec prettier ${tempFilePath} --config ../../.prettierrc --write`, { cwd: __dirname });
await execAsync(`mkdir -p ${path.dirname(tsDisplayNameFilePath)}`, { cwd: __dirname });
await execAsync(`cp ${tempFilePath} ${tsDisplayNameFilePath}`, { cwd: __dirname });
