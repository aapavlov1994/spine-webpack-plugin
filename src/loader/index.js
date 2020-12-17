const getOptions = require('./getOptions');
const getUsedAssets = require('./getUsedAssets');
const cleanUnusedProps = require('./cleanUnusedProps');
const { pluginName } = require('../consts');

// eslint-disable-next-line consistent-return
function spineLoader(buffer) {
  const spineConfig = JSON.parse(buffer);
  const {
    animations: usedAnims,
    skins: usedSkins,
    scale,
  } = getOptions.call(this);

  cleanUnusedProps(spineConfig, usedAnims);

  if (scale) { // if scale => make sprite from used scaled assets
    const done = this.async();
    if (usedSkins && !usedSkins.includes('default')) usedSkins.unshift('default');
    const assets = getUsedAssets.call(this, spineConfig, usedSkins);
    this[pluginName].genSpriteFor(spineConfig.skeleton.hash, scale, assets)
      .then((result) => {
        const { map, sprite } = result;
        // gen output module
        delete spineConfig.skeleton.images;
        spineConfig.skeleton.scale = scale;
        const skeleton = JSON.stringify(spineConfig.skeleton);
        delete spineConfig.skeleton;

        this.resolve(sprite, '', () => { this.dependency(sprite); });

        const newOutput = 'const output = {};\n'
          + `output.skeleton = ${skeleton};\n`
          + 'output.skeleton.sprite = {};\n'
          + `output.skeleton.sprite.src = require(${JSON.stringify(sprite)});\n`
          + `output.skeleton.sprite.map = require(${JSON.stringify(map)});\n`
          + `Object.assign(output, ${JSON.stringify(spineConfig)});`
          + 'module.exports = output;';
        done(null, newOutput);
      });
  } else { // if !scale => only anims and events needs
    const { events, animations } = spineConfig;
    return `module.exports = ${JSON.stringify({ events, animations })}`;
  }
}

module.exports = spineLoader;
