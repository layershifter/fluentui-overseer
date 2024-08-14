module.exports = {
  name: "Github Issues",
  data: './prepare/index.js',
  prepare: './discovery-pages/prepare.js',
  view: {
    assets: [
      "discovery-pages/index.js",
      "discovery-views/info-icon.css",
      "discovery-views/info-icon.js",
      "discovery-views/page-indicator.css",
      "discovery-views/page-indicator.js",
      "discovery-views/text-with-unit.js",
    ],
  },
};
