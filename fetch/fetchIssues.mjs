import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { URL } from "node:url";

function escapeQuery(arg) {
  return `${arg.replace(/"/g, '"').replace(/\n/g, " ").replace(/\s+/g, " ")}`;
}

export async function fetchIssues() {
  const dirname = new URL(".", import.meta.url).pathname;
  const schema = (
    await fs.readFile(path.resolve(dirname, "./fetchIssues.gql"), "utf8")
  ).trim();

  spawnSync(
    `gh`,
    [
      "api",
      "graphql",
      "--paginate",
      "--slurp",
      "-F",
      `query=${escapeQuery(schema)}`,
    ],
    {
      stdio: "inherit",
    },
  );
}

await fetchIssues();
