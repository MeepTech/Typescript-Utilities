const fs = require('file-system');

/**
 * Used to copy the package.json file to the build folder
 *
 * @plugin webpack
 */
module.exports = class {
  constructor(env) {
    this.env = env;
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tap(
      'BuildPackageJson',
      () => {
        console.log('Building package.json');
        const base = require('../../../package.json');

        if (this.env === 'dev') {
          base.name += '-dev';
          base.description += ' (dev)';
          base.keywords.push('dev');
        }

        base.scripts = {
          pack: `cd "..\\..\\dist\\npm\\${this.env}" && npm pack "..\\..\\..\\build\\${this.env}"`,
        };

        delete base.devDependencies;
        delete base.babel;

        fs.writeFileSync(
          `./build/${this.env}/package.json`,
          JSON.stringify(base, null, 2)
        );

        console.log('Done building package.json');
      }
    );
  }
};
