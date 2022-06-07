module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "plugin:vue/essential",
    "airbnb-base",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["vue", "prettier"],
  rules: {
    "import/no-extraneous-dependencies": "off",
    "vue/multi-word-component-names": "off",
    "no-underscore-dangle": "off",
    "no-param-reassign": "off",
    "no-restricted-syntax": "off",
    "guard-for-in": "off",
    "no-plusplus": "off",
    "class-methods-use-this": "off",
    "no-useless-constructor": "off",
    "no-new-func": "off",
    "vue/script-setup-uses-vars": "off",
    "no-restricted-globals": ["error", "isFinite", "isNaN"],
  },
};
