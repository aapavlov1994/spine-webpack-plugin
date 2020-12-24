const path = require('path');

const getExistName = (...values) => `${values.find((val) => typeof val !== 'undefined')}.png`;

module.exports = function getUsedAssets(config, usedSkins) {
  const assets = {};
  config.skins.forEach((skin) => {
    Object.keys(skin.attachments).forEach((slotName) => {
      Object.keys(skin.attachments[slotName]).forEach((entryName) => {
        const attachment = skin.attachments[slotName][entryName];
        const newName = getExistName(attachment.path, attachment.name, entryName);
        if (usedSkins && !usedSkins.includes(skin.name)) assets[newName] = false;
        else assets[newName] = path.resolve(this.resourcePath, '../images', newName);
      });
    });
  });
  return assets;
};
