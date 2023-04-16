const path = require('node:path');

module.exports = {
  parserOptions: {
    project: path.join(__dirname, "tsconfig.json"),
  },
  extends: [
    "eslint-config-games-deals",
  ],
  env: {
    jest: true
  },
}
