module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname
  },
  extends: ["prettier", "plugin:storybook/recommended"],
  plugins: ["@typescript-eslint/eslint-plugin", "react", "prettier", "json-format", "simple-import-sort"],
  ignorePatterns: ['.eslintrc.js', 'public', 'node_modules', '.cache', '.vscode', 'schema/*'],
  rules: {
    "no-unused-vars": "error",
    "@typescript-eslint/consistent-type-imports": ["error", {
      prefer: "type-imports",
      disallowTypeAnnotations: false
    }],
    "prettier/prettier": ["error", {
      singleQuote: false,
      semi: true,
      tabWidth: 2,
      useTabs: false,
      trailingComma: "all",
      printWidth: 80,
      arrowParens: "always"
    }, {
      usePrettierrc: false
    }],
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error"
  }
};