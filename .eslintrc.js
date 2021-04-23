module.exports = {
  root: true,
  plugins: ["import", "simple-import-sort"],
  extends: [
    "react-app",
    "react-app/jest",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
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
