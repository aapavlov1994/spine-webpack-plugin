const path = require('path');

const { pluginName } = require('../consts');

// eslint-disable-next-line consistent-return
function spineLoader(buffer) {
  const spineConfig = JSON.parse(buffer);

  const getOptionByName = (name) => (
    (this.getOptions && this.getOptions()[name])
    || (typeof this.resourceQuery === 'string'
      && this.resourceQuery !== ''
      && JSON.parse(this.resourceQuery.replace(/^\?/, ''))[name])
    || (typeof this.query === 'object' && this.query[name]) // webpack4
  )

  // clean unused animations
  const optAnims = getOptionByName('animations');
  const scale = getOptionByName('scale');
  if (optAnims) {
    const usedEvents = new Set();
    Object.keys(spineConfig.animations).forEach((key) => {
      if (!optAnims.includes(key)) delete spineConfig.animations[key];
      else spineConfig.animations[key].events.forEach(({ name }) => { usedEvents.add(name); });
    });
    // clean unused events
    Object.keys(spineConfig.events).forEach((key) => {
      if (!usedEvents.has(key)) delete spineConfig.events[key];
    });
  }

  if (scale) { // if scale => add assets to dependencies and output json
    const done = this.async();
    // get uniq used assets names
    const assets = {};
    spineConfig.skins.forEach((skin) => {
      Object.keys(skin.attachments).forEach((attachmentName) => {
        Object.keys(skin.attachments[attachmentName]).forEach((imageName) => {
          const newName = `${imageName}.png`;
          assets[newName] = path.resolve(this.resourcePath, '../images', newName);
        });
      });
    });
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
