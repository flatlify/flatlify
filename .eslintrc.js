module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: ["airbnb-base"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    quotes: ["error", "double"],
    "no-shadow": "off",
    "operator-linebreak": "off",
    "no-underscore-dangle": "off",
    "implicit-arrow-linebreak": "off",
    "function-paren-newline": "off",
    "no-console": ["error", { allow: ["warn", "error", "info"] }],
    "arrow-body-style": "off",
  },
};
