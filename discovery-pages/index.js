const basicIssueTable = {
  view: 'switch',
  content: [
    { when: 'no $', content: 'text:"No issues"' },
    { content: {
      view: "table",
      cols: [
        {
          header: "ID",
          data: "id",
          content: 'link:{ href: "https://github.com/microsoft/fluentui/issues/" + $, text: "#" + $, external: true }',
        },
        {
          header: "Title",
          data: "title",
          content: "text",
        },
      ],
    } }
  ]
};

discovery.page.define("default", [
  {
    view: "page-header",
    prelude: ['text:"Data snapshot "', 'badge:timestamp'],
    content: 'h1:"Fluent UI Github Issues"',
  },

  {
    view: 'page-indicators',
    content: [
      { title: 'Open issues', value: '=issues.size()' },
      {
        view: 'page-indicator-group',
        content: `=areaLabels.($area: $; {
          title: replace("Fluent UI", ""),
          value: @.issues.count(=> labels has $area?)
        })`,
      },
    ],
  },

  {
    view: "section",
    data: `
      $areas: #.data.areaLabels; 

      issues
        .[labels.count(=>$ in $areas?) = 0]
        .sort(id desc)
    `,
    header: [
      'text:"Issues without assigned area "',
      'pill-badge{ whenData: true, color: "#da3b01", text: size() }',
      { view: 'info-icon', content: 'text:`There are issues that don\'t have an assigned area, we track following: ${#.data.areaLabels.join(", ")}.`' }
    ],
    content: [
      basicIssueTable
    ],
  },

  {
    view: "section",
    data: `
      .issues
        .[labels.[$ = 'Fluent UI react-components (v9)']]
        .({
          id,
          title,
          isUnderTriage: labels.[$ = "Needs: Triage :mag:" or $ = "Needs: Author Feedback"].size() > 0,
          isOnBoard: projectItems.[$.project = 'Fluent UI - Unified'].size() > 0
        })
        .[not isOnBoard and not isUnderTriage]
        .sort(id desc)
    `,
    header: [
      'text:"v9 issues not on the board "',
      'pill-badge{ whenData: true, color: "#da3b01", text: size() }',
      { view: 'info-icon', content: `text:"There are issues that have 'Fluent UI react-components (v9)' label, but are *not present* in the board. Issues with 'Needs: Triage' & 'Needs: Needs: Author Feedback' labels are excluded."` },
    ],
    content: [
      basicIssueTable
    ],
  },

  {
    view: "section",
    data: `
      .issues
        .[labels.[$ = 'Fluent UI react-components (v9)']]
        .({ id, title, board: projectItems.[$.project = 'Fluent UI - Unified'][] })
        .[board.isArchived or board.status = "Done"]
        .sort(id desc)
    `,
    header: [
      'text:"v9 issues are archived or done "',
      'pill-badge{ whenData: true, color: "#da3b01", text: size() }',
      { view: 'info-icon', content: 'text:"There are issues that marked as archived or done in the Unified board."' },
    ],
    content: [
      basicIssueTable
    ]
  },

  {
    view: "section",
    data: `
      $paths: pathLabels;

      .issues
        .[labels.[$ = "Fluent UI react-components (v9)"]]
        .({ 
          id,
          title,
          isUnderTriage: labels.[$ = "Needs: Triage :mag:" or $ = "Needs: Author Feedback"].size() > 0,
          isMissingPath: labels.[$ ~= /^Component/ or $ in $paths].size() = 0
        })
        .[not isUnderTriage and isMissingPath]
        .sort(id desc)
    `,
    header: [
      'text:"v9 issues without path labels "',
      'pill-badge{ whenData: true, color: "#da3b01", text: size() }',
      { view: 'info-icon', content: 'text:`There are issues that have \'Fluent UI react-components (v9)\' label, but do not have ${#.data.pathLabels.(`\'${$}\'`).join(", ")} labels. Issues with \'Needs: Triage\' & \'Needs: Needs: Author Feedback\' labels are excluded.`' },
    ],
    content: [
      basicIssueTable
    ],
  },

  {
    view: "section",
    data: `
      .issues
        .({ id, title, project: projectItems.[project = "Fluent UI - Unified"][0] })
        .[project is not undefined]
        .[project.assignedTeam is undefined]
        .sort(id desc)
    `,
    header: [
      'text:"Issues on Unified board without assigned team "',
      'pill-badge{ whenData: true, color: "#da3b01", text: size() }',
      { view: 'info-icon', content: 'text:"There are issues that are on the Unified board, but don\'t have a team assigned "' },
    ],
    content: [
      basicIssueTable,
    ],
  },

  {
    view: "section",
    data: `
      .issues
        .[projectItems.project has "Fluent UI - Unified" and labels has "Fluent UI react-components (v9)"]
        .({ id, title, component: labels[=>$ ~= /^Component/], currentOwner: projectItems[=> project = "Fluent UI - Unified"].assignedTeam })
        .[currentOwner is not undefined]
        .[component is not undefined]
        .({ ..., component: component.replace(/^Component: /, "") })
        .({ ..., expectedOwner: #.data.codeowners[component].owners })
        .[currentOwner != "v-pm" and currentOwner not in expectedOwner]
    `,
    header: [
      'text:"Issues with unexpected owners "',
      'pill-badge{ whenData: true, color: "#da3b01", text: size() }',
      { view: 'info-icon', content: 'text:"There are issues that may have unexpected or invalid owners."' },
    ],
    content: [
      {
        view: "table",
        cols: [
          {
            header: "ID",
            data: "id",
            content: 'link:{ href: "https://github.com/microsoft/fluentui/issues/" + $, text: "#" + $, external: true }',
          },
          {
            header: "Title",
            data: "title",
          },
          {
            header: "Component",
            data: "component",
          },
          {
            header: "Current owner",
            data: "currentOwner",
          },
          {
            header: "Expected owner(s)",
            data: "expectedOwner",
            content: {
              view: 'inline-list',
              whenData: true,
              item: 'pill-badge'
            },
          },
        ],
      },
    ],
  },
]);
