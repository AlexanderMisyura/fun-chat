export default {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-clean-order/error',
    'stylelint-config-css-modules',
  ],
  ignoreFiles: ['dist/**/*', 'node_modules/**/*'],
  plugins: ['stylelint-use-logical-spec'],
  rules: {
    'liberty/use-logical-spec': true,
    'declaration-property-value-no-unknown': true,
    'selector-class-pattern': undefined,
    'keyframes-name-pattern': undefined,
  },
};
