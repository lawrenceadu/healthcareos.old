const { mergeConfig } = require('vite');

module.exports = {
  core: { builder: '@storybook/builder-vite' },
  stories: [
    '../src/lib/**/*.stories.mdx',
    '../src/lib/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: ['@storybook/addon-essentials', 'storybook-addon-swc'],
  async viteFinal(config, { configType }) {
    return mergeConfig(config, {});
  },
};
