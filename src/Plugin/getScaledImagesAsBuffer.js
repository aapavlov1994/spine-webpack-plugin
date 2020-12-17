const Jimp = require('jimp');
const Vinyl = require('vinyl');

const empty = require.resolve('./empty.png');

module.exports = function getScaledImagesAsBuffer(assets, scale) {
  return new Promise((globalResolve) => {
    const output = [];
    const promises = Object.keys(assets).map((key) => new Promise((resolve) => {
      if (assets[key]) {
        Jimp.read(assets[key])
          .then((jimpInstance) => jimpInstance.scale(scale))
          // eslint-disable-next-line no-underscore-dangle
          .then((scaleInstance) => scaleInstance.getBufferAsync(scaleInstance._originalMime))
          .then((buffer) => {
            output.push(new Vinyl({ contents: buffer, path: key }));
            resolve();
          });
      } else {
        Jimp.read(empty)
          // eslint-disable-next-line no-underscore-dangle
          .then((jimpInstance) => jimpInstance.getBufferAsync(jimpInstance._originalMime))
          .then((buffer) => {
            output.push(new Vinyl({ contents: buffer, path: key }));
            resolve();
          });
      }
    }));
    Promise.all(promises).then(() => globalResolve(output));
  });
};
