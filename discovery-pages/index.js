const AREA_LABELS = [
  "Area: Build System",
  "Package: charting",
  "Fluent UI react (v8)",
  "Fluent UI react-components (v9)",
  "Fluent UI react-northstar (v0)",
  "web-components",
];

//
// Queries
//

const ISSUES_WITHOUT_AREA_LABEL_QUERY = `
$areas: ${JSON.stringify(AREA_LABELS)}; 

.issues.({ id, title, areas: labels.[$ in $areas] }).[areas.size() = 0]
`;
const IMPROPERLY_TRACKED_ISSUES_QUERY = `
.issues
  .[labels.[$ = 'Fluent UI react-components (v9)']]
  .({ id, title, isOnBoard: projectItems.[$.project = 'Fluent UI - Unified'].size() > 0 })
  .[isOnBoard = false]
`;

const IMPROPERLY_LABELED_ISSUES_QUERY = `
.issues
  .[labels.[$ = "Fluent UI react-components (v9)"]]
  .({ id, title, labels: labels.[$.indexOf("Component") = 0 or $ = "Area: Build System" or $ = "Area: Positioning"] })
  .[labels.size() = 0]
`;

const ISSUES_ON_BOARD_WITHOUT_ASSIGNED_TEAM_QUERY = `
.issues
  .({ id, title, project: projectItems.[project = "Fluent UI - Unified"][0] })
  .[project is not undefined]
  .[project.assignedTeam is undefined]
`;

const OWNERSHIP_ISSUES_QUERY = `
.issues
  .[projectItems.[project = "Fluent UI - Unified"] and labels.[$ = "Fluent UI react-components (v9)"]]
  .({ id, title, component: labels.[$.indexOf("Component") = 0][], currentOwner: projectItems.[project = "Fluent UI - Unified"][].assignedTeam })
  .[currentOwner is not undefined]
  .[component is not undefined]
  .({ ..., component: component.replace("Component: ", "") })
  .({ ..., expectedOwner: #.data.codeowners[component].owners })
  .[currentOwner != "v-pm" and currentOwner not in expectedOwner]
`;

discovery.page.define("default", [
  {
    view: "page-header",
    prelude: ['text:"Data snapshot "', { view: "badge", data: "timestamp" }],
    content: 'h1:"Fluent UI Github Issues"',
  },

  {
    view: "inline-list",
    item: "indicator",
    data: `[
      { label: 'Open issues', value: .issues.size() },
      { label: 'v9 issues', value: .issues.[labels.[$ = 'Fluent UI react-components (v9)']].size() },
      { label: 'v8 issues', value: .issues.[labels.[$ = 'Fluent UI react (v8)']].size() },
      { label: 'v0 issues', value: .issues.[labels.[$ = 'Fluent UI react-northstar']].size() },
    ]`,
  },

  {
    view: "section",
    header: {
      view: "hstack",
      content: [
        'text:"Issues with assigned area"',
        {
          view: "block",
          content: [
            {
              view: "badge",
              color: "#da3b01",
              textColor: "#ffffff",
              data: `${ISSUES_WITHOUT_AREA_LABEL_QUERY}.size()`,
            },
          ],
        },
      ],
    },
    content: [
      `alert:"There are issues that don't have an assigned area, we track following: ${AREA_LABELS.join(", ")}."`,
    ],
  },
  [
    {
      view: "table",
      cols: [
        {
          header: "ID",
          data: "id",
          content: {
            view: "link",
            data: '{ href: "https://github.com/microsoft/fluentui/issues/" + $, text: "#" + $ }',
            external: true,
          },
        },
        {
          header: "Title",
          data: "title",
          content: "text:$",
        },
      ],
      data: `${ISSUES_WITHOUT_AREA_LABEL_QUERY}.sort(id desc)`,
    },
  ],

  {
    view: "section",
    header: {
      view: "hstack",
      content: [
        'text:"Improperly tracked issues"',
        {
          view: "block",
          content: [
            {
              view: "badge",
              color: "#da3b01",
              textColor: "#ffffff",
              data: `${IMPROPERLY_TRACKED_ISSUES_QUERY}.size()`,
            },
          ],
        },
      ],
    },
    content: [
      "alert:\"There are issues that have 'Fluent UI react-components (v9)' label, but are *not present* in the board.\"",
    ],
  },
  [
    {
      view: "table",
      cols: [
        {
          header: "ID",
          data: "id",
          content: {
            view: "link",
            data: '{ href: "https://github.com/microsoft/fluentui/issues/" + $, text: "#" + $ }',
            external: true,
          },
        },
        {
          header: "Title",
          data: "title",
          content: "text:$",
        },
      ],
      data: `${IMPROPERLY_TRACKED_ISSUES_QUERY}.sort(id desc)`,
    },
  ],

  {
    view: "section",
    header: {
      view: "hstack",
      content: [
        'text:"Improperly labeled issues"',
        {
          view: "block",
          content: [
            {
              view: "badge",
              color: "#da3b01",
              textColor: "#ffffff",
              data: `${IMPROPERLY_LABELED_ISSUES_QUERY}.size()`,
            },
          ],
        },
      ],
    },
    content: [
      "alert:\"There are issues that have 'Fluent UI react-components (v9)' label, but do not have 'Component:*' or 'Area: Build System' labels.\"",
    ],
  },
  [
    {
      view: "table",
      cols: [
        {
          header: "ID",
          data: "id",
          content: {
            view: "link",
            data: '{ href: "https://github.com/microsoft/fluentui/issues/" + $, text: "#" + $ }',
            external: true,
          },
        },
        {
          header: "Title",
          data: "title",
          content: "text:$",
        },
      ],
      data: `${IMPROPERLY_LABELED_ISSUES_QUERY}.sort(id desc)`,
    },
  ],

  {
    view: "section",
    header: {
      view: "hstack",
      content: [
        'text:"Issues without assigned team"',
        {
          view: "block",
          content: [
            {
              view: "badge",
              color: "#da3b01",
              textColor: "#ffffff",
              data: `${ISSUES_ON_BOARD_WITHOUT_ASSIGNED_TEAM_QUERY}.size()`,
            },
          ],
        },
      ],
    },
    content: [
      'alert:"There are issues that are on the Unified board, but don\'t have a team assigned "',
    ],
  },
  [
    {
      view: "table",
      cols: [
        {
          header: "ID",
          data: "id",
          content: {
            view: "link",
            data: '{ href: "https://github.com/microsoft/fluentui/issues/" + $, text: "#" + $ }',
            external: true,
          },
        },
        {
          header: "Title",
          data: "title",
          content: "text:$",
        },
      ],
      data: `${ISSUES_ON_BOARD_WITHOUT_ASSIGNED_TEAM_QUERY}.sort(id desc)`,
    },
  ],

  {
    view: "section",
    header: {
      view: "hstack",
      content: [
        'text:"Issues with unexpected owners"',
        {
          view: "block",
          content: [
            {
              view: "badge",
              color: "#da3b01",
              textColor: "#ffffff",
              data: `${OWNERSHIP_ISSUES_QUERY}.size()`,
            },
          ],
        },
      ],
    },
    content: [
      'alert:"There are issues that may have unexpected or invalid owners."',
    ],
  },
  [
    {
      view: "table",
      cols: [
        {
          header: "ID",
          data: "id",
          content: {
            view: "link",
            data: '{ href: "https://github.com/microsoft/fluentui/issues/" + $, text: "#" + $ }',
            external: true,
          },
        },
        {
          header: "Title",
          data: "title",
          content: "text:$",
        },
        {
          header: "Component",
          data: "component",
          content: "text:$",
        },
        {
          header: "Current owner",
          data: "currentOwner",
          content: "text:$",
        },
        {
          header: "Expected owner(s)",
          data: "expectedOwner",
          content: "struct",
        },
      ],
      data: OWNERSHIP_ISSUES_QUERY,
    },
  ],
]);
