module.exports = {
  env: {
    es6: true,
    node: true,
    browser: true
  },
  extends: ['eslint:recommended', './rules.yaml'],
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      arrowFunctions: true,
      blockBindings: true,
      classes: true,
      defaultParams: true,
      destructuring: true,
      restParams: true,
      spread: true,
      templateStrings: true
    }
  }
};
