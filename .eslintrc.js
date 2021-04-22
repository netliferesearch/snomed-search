module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["jest", "simple-import-sort", "import", "@typescript-eslint"],
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:jest/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  rules: {
    "import/no-extraneous-dependencies": "error",
    "import/order": "off",
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "one-var": ["error", "never"],
    "simple-import-sort/exports": "error",
    "simple-import-sort/imports": "error",
    "sort-imports": "off",
  },
};
