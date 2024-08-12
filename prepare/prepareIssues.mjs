import fs from "node:fs/promises";
import { z } from "zod";

const Label = z.object({
  name: z.string(),
});
const ProjectItem = z.object({
  project: z.object({ title: z.string() }),
  assignedTeam: z.object({ name: z.string() }).nullable(),
  isArchived: z.boolean(),
  status: z.object({ name: z.string() }).nullable(),
  type: z.string(),
});
const Issue = z.object({
  id: z.number(),
  title: z.string(),
  labels: z.object({
    nodes: z.array(Label),
  }),
  projectItems: z.object({ nodes: z.array(ProjectItem) }),
});

const RawJson = z.array(
  z.object({
    data: z.object({
      repository: z.object({
        issues: z.object({
          edges: z.array(z.object({ node: Issue })),
        }),
      }),
    }),
  }),
);

export async function prepareIssues() {
  const content = await fs.readFile("./data/issues.json", "utf-8");
  const data = JSON.parse(content);

  const result = RawJson.parse(data);
  const issues = result.flatMap((chunk) =>
    chunk.data.repository.issues.edges.map((item) => ({
      id: item.node.id,
      title: item.node.title,
      labels: item.node.labels.nodes.map((label) => label.name),
      projectItems: item.node.projectItems.nodes
        .filter((projectItem) => projectItem.type === "ISSUE")
        .map((projectItem) => ({
          project: projectItem.project.title,
          isArchived: projectItem.isArchived,
          status: projectItem.status?.name.replace(/[^a-z]/gi, ""),
          assignedTeam: projectItem.assignedTeam?.name,
        })),
    })),
  );

  return issues;
}
