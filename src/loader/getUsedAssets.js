const path = require('path');

module.exports = function getUsedAssets(config, usedSkins) {
  const assets = {};
  config.skins.forEach((skin) => {
    Object.keys(skin.attachments).forEach((attachmentName) => {
      Object.keys(skin.attachments[attachmentName]).forEach((imageName) => {
        const newName = skin.name === 'default'
          ? `${imageName}.png`
          : `${skin.attachments[attachmentName][imageName].name}.png`;
        if (usedSkins && !usedSkins.includes(skin.name)) assets[newName] = false;
        else assets[newName] = path.resolve(this.resourcePath, '../images', newName);
      });
    });
  });
  return assets;
};
