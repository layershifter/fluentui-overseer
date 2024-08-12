import fs from "node:fs/promises";
import path from "node:path";
import { URL } from "node:url";

const CODE_OWNERS_PATH = path.resolve(
  new URL(".", import.meta.url).pathname,
  "../data/codeowners.txt",
);
const V9_DIRECTORY = "packages/react-components";

/**
 * @param {string} value
 */
function toPascalCase(value) {
  return value
    .replace(/(?:^|-)(\w)/g, (_, letter) => letter.toUpperCase())
    .replace(/-/g, "");
}

/**
 * @param {string} pattern
 */
function getPackageMeta(pattern) {
  if (!pattern.startsWith(V9_DIRECTORY) || !pattern.endsWith("/library")) {
    throw new Error(`Invalid pattern: ${pattern}`);
  }

  const packageName = pattern
    .replace(V9_DIRECTORY + "/", "")
    .replace("/library", "")
    .replace("-preview", "");

  return {
    packageName,
    component: toPascalCase(packageName.replace(/^react-/, "")),
  };
}

export async function prepareCodeOwners() {
  const content = await fs.readFile(CODE_OWNERS_PATH, "utf8");
  const components = Object.fromEntries(
    content
      .split("\n")
      .filter(
        (line) => line.startsWith(V9_DIRECTORY) && line.includes("/library"),
      )
      .map((line) => {
        const [pattern, ...owners] = line.split(/\s+/);
        const teams = owners
          .filter((owner) => owner.startsWith("@microsoft/"))
          .map((owner) => owner.replace(/^@microsoft\//, ""));
        const { packageName, component } = getPackageMeta(pattern);

        return [
          component,
          {
            pattern,
            packageName,
            owners: teams,
          },
        ];
      }),
  );

  //
  // Manual overrides

  // Missing components
  components["Dropdown"] = components.Combobox;
  components["DataGrid"] = components.Table;

  // Casing fixes
  components["SpinButton"] = components.Spinbutton;
  components["InfoLabel"] = components.Infolabel;

  return components;
}
