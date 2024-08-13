module.exports = async function data() {
    const { prepareCodeOwners } = await import("./prepareCodeOwners.mjs");
    const { prepareIssues } = await import("./prepareIssues.mjs");
    const { prepareTimestamp } = await import("./prepareTimestamp.mjs");

    return {
      codeowners: await prepareCodeOwners(),
      issues: await prepareIssues(),
      timestamp: await prepareTimestamp(),
    };
}
