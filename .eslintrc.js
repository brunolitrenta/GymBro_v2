// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: 'expo',
  ignorePatterns: ['/dist/*'],
  rules: {
    // Requested: ignore React Hooks naming/component check errors
    'react-hooks/rules-of-hooks': 'off',
  },
};
