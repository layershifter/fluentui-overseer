import fs from "node:fs/promises";
import path from "node:path";
import { URL } from "node:url";

const TIMESTAMP_PATH = path.resolve(
  new URL(".", import.meta.url).pathname,
  "../data/timestamp.txt",
);

export async function prepareTimestamp() {
  return await fs.readFile(TIMESTAMP_PATH, "utf8");
}
