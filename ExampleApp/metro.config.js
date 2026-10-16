const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const escapeRegExp = (value) => value.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');

const config = {
  watchFolders: [workspaceRoot],
  resolver: {
    nodeModulesPaths: [path.resolve(projectRoot, 'node_modules')],
    extraNodeModules: {
      'react-native-animated-codes': workspaceRoot,
    },
    // Package root has its own react / react-native / reanimated / svg dev copies for typechecking,
    // block them so the app always resolves a single copy from ExampleApp/node_modules
    blockList: [new RegExp(`^${escapeRegExp(path.join(workspaceRoot, 'node_modules'))}\\/.*$`)],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
