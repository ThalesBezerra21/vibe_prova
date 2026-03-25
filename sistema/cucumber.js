module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['features/support/**/*.ts', 'features/step_definitions/**/*.ts'],
    format: ['progress', 'json:reports/cucumber.json'],
    paths: ['features/**/*.feature'],
  },
};
