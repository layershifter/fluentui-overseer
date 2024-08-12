module.exports = {
  name: "Github Issues",
  async data() {
    const { prepareCodeOwners } = await import(
      "./prepare/prepareCodeOwners.mjs"
    );
    const { prepareIssues } = await import("./prepare/prepareIssues.mjs");
    const { prepareTimestamp } = await import("./prepare/prepareTimestamp.mjs");

    return {
      codeowners: await prepareCodeOwners(),
      issues: await prepareIssues(),
      timestamp: await prepareTimestamp(),
    };
  },
  view: {
    assets: ["discovery-pages/index.js"],
  },
};
