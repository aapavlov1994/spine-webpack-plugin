const Jimp = require('jimp');
const Vinyl = require('vinyl');

module.exports = function getScaledImagesAsBuffer(assets, scale) {
  return new Promise((globalResolve) => {
    const output = [];
    const promises = Object.keys(assets).map((key) => new Promise((resolve) => {
      Jimp.read(assets[key])
        .then((jimpInstance) => jimpInstance.scale(scale))
        // eslint-disable-next-line no-underscore-dangle
        .then((scaleInstance) => scaleInstance.getBufferAsync(scaleInstance._originalMime))
        .then((buffer) => {
          output.push(new Vinyl({ contents: buffer, path: key }));
          resolve();
        });
    }));
    Promise.all(promises).then(() => globalResolve(output));
  });
};
