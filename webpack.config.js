// webpack.config.js
const { fs } = require('file-system');
const path = require('path');
const BuildPackageJsonPlugin = require('./.scripts/webpack/plugins/build-package-json');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');

const DEV_ONLY = {
  mode: 'development',
  devtool: 'inline-source-map',
  stats: 'verbose',
};

const PROD_ONLY = {
  mode: 'production',
};

const SHARED = env => ({
  entry: path.resolve(__dirname, 'src', 'lib.ts'),
  output: {
    filename: `lib.js`,
    libraryTarget: 'umd',
    library: '@meep-tech/utils',
    globalObject: 'this',
    path: path.resolve(__dirname, 'build', env),
  },
  resolve: {
    extensions: ['.ts'],
  },
  module: {
    // uses babel to build the js files
    rules: [
      {
        test: /\.ts$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          // type.ts => type.js
          { loader: 'babel-loader' },
        ],
      },
    ],
  },
  plugins: [
    // clear the previous build
    new WebpackShellPluginNext({
      onBuildStart: {
        scripts: ['rm -rf ./build/' + env],
        blocking: true,
        parallel: false,
      },
      safe: true,
      logging: true,
    }),
    // run tsc to check for errors before webpack starts
    new WebpackShellPluginNext({
      onBuildStart: {
        scripts: [
          'npx tsc --noEmit --project tsconfig.tests.json',
        ],
        blocking: true,
        parallel: false,
      },
      safe: true,
      logging: true,
    }),
    // run tsc to generate the types
    new WebpackShellPluginNext({
      onBuildEnd: {
        scripts: [
          'npx tsc --project tsconfig.json --outDir ./build/' +
            env +
            (env === 'prod'
              ? ' --sourceMap true'
              : ' --inlineSourceMap true --sourceMap false --explainFiles true'),
        ],
        blocking: true,
        parallel: false,
      },
      safe: true,
      logging: true,
    }),
    // build the package.json file after webpack is done
    new BuildPackageJsonPlugin(env),
  ],
});

// build log and export the webpack config
module.exports = ({ dev } = {}) => {
  const env = dev ? 'dev' : 'prod';

  const shared = SHARED(env);

  const buildConfig = {
    ...shared,
    ...(dev ? DEV_ONLY : PROD_ONLY),
  };

  const json = JSON.stringify(
    buildConfig,
    null,
    2
  );

  // log the webapck config to the console.
  console.log(json);

  // log the webpack config to the build outpit as a file.
  const outputConfigFile = path.resolve(
    __dirname,
    'build',
    env,
    'webpack.config.json'
  );
  fs.mkdirSync(path.dirname(outputConfigFile), {
    recursive: true,
  });
  fs.writeFileSync(outputConfigFile, json);

  return buildConfig;
};
