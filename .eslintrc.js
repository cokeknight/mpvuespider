module.exports = {
  root: true,
  globals: {
    wx: true,
    node: true,
    'document': true,
    'localStorage': true,
    'window': true,
    'config': true,
    'components': true,
    'mixins': true,
    'data': true,
    'computed': true,
    'methods': true,
    'events': true,
    'globalData': true
  },
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended'
  ],
  // required to lint *.wpy files
  plugins: [
    'html'
  ],
  settings: {
    'html/html-extensions': ['.html', '.wpy']
  },
  // add your custom rules here
  'rules': {
    // 'no-unused-vars': 0,
    'no-console': 0,
    'no-undef': [0],
    'vue/vaild-v-on': 'off',
    'semi': [0],
    'eqeqeq': [0],
    // 'indent': ['error', 2],
    // 'object-curly-spacing': [2, 'always'],
    // 'comma-dangle': ['error', 'ignore'],
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'space-before-function-paren': 0,
    "vue/max-attributes-per-line": ["off"],
    "vue/require-default-prop": ['off'],
    'vue/html-self-closing': ['off']
  }
};
