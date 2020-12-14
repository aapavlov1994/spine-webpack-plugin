const path = require('path');
const fs = require('fs-extra');
const findCacheDir = require('find-cache-dir');
const Spritesmith = require('spritesmith');

const { packageName, pluginName } = require('../consts');
const getScaledImagesAsBuffer = require('./getScaledImagesAsBuffer');
const getSpineMap = require('./getSpineMap');

const cacheThunk = findCacheDir({
  name: packageName,
  create: true,
  thunk: true,
});

const writeFile = (pathTo, data) => (
  new Promise((resolve) => {
    fs.outputFile(
      pathTo,
      data,
      'utf8',
      resolve,
    );
  })
);

module.exports = class SpineSpriteMapWebpackPlugin {
  constructor() {
    this.spritesHashes = new Map();
  }

  apply(compiler) {
    this.cacheCompilerDir = cacheThunk(compiler.name || compiler.options.name || '');

    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      compilation.hooks.normalModuleLoader.tap(pluginName, (spineLoader) => {
        spineLoader[pluginName] = this; // eslint-disable-line no-param-reassign
      });
    });
  }

  genSpriteFor(hash, scale, assets) {
    if (!this.spritesHashes.has(hash)) this.spritesHashes.set(hash, this.spritesHashes.size + 1);
    return new Promise((resolve) => {
      getScaledImagesAsBuffer(assets, scale).then((result) => {
        Spritesmith.run({ src: result }, (err, output) => {
          const postfix = this.spritesHashes.get(hash);
          const spritePath = path.join(this.cacheCompilerDir, `sprite${postfix}.png`);
          const mapPath = path.join(this.cacheCompilerDir, `map${postfix}.js`);
          const mapModule = getSpineMap(output);
          writeFile(spritePath, output.image)
            .then(() => writeFile(mapPath, mapModule))
            .then(() => {
              resolve({ map: path.resolve(mapPath), sprite: path.resolve(spritePath) });
            });
        });
      });
    });
  }
};
