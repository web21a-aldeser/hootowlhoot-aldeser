module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
	  // Allow modifying properties through function's params
    'no-param-reassign': ["error", { "props": false }],
    // Allow defensive programming
    'no-console': "off",
	 "indent": ["error", 4],
	'no-loop-func': ["error"],
	'class-methods-use-this': ["error"],
	"import/extensions": ['error', 'always', {"ignorePackages": true} ],
  },
};
