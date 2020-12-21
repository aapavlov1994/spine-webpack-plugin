const path = require('path');

module.exports = function getUsedAssets(config, usedSkins) {
  const assets = {};
  config.skins.forEach((skin) => {
    Object.keys(skin.attachments).forEach((attachmentName) => {
      Object.keys(skin.attachments[attachmentName]).forEach((imageName) => {
        let newName;
        if (skin.name === 'default') newName = `${imageName}.png`;
        else {
          const attachment = skin.attachments[attachmentName][imageName];
          if (typeof attachment.name !== 'undefined') {
            newName = `${attachment.name}.png`;
          } else if (typeof attachment.path !== 'undefined') {
            newName = `${attachment.path}.png`;
          } else {
            throw new Error(`No "path" or "name" field for "${skin.name}" skin's attachments.`);
          }
        }
        if (usedSkins && !usedSkins.includes(skin.name)) assets[newName] = false;
        else assets[newName] = path.resolve(this.resourcePath, '../images', newName);
      });
    });
  });
  return assets;
};
