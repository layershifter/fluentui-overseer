const AREA_LABELS = [
    "Fluent UI react-components (v9)",
    "Fluent UI react (v8)",
    "Fluent UI react-northstar (v0)",
    "web-components",
    "Area: Build System",
    "Package: charting",
];

const PATH_LABELS = [
    "Component:*",
    "Package: docs",
    "Package: icons",
    "Package: motion",
    "Package: migration",
    "Package: positioning",
    "Package: priority-overflow",
    "Package: utilities",
    "Package: theme",
    "Area: Build System",
  ];

module.exports = function prepare(data) {
    data.areaLabels = AREA_LABELS;
    data.pathLabels = PATH_LABELS;
}
