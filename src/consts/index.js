const { name: packageName } = require('../../package.json');

const pluginName = packageName
  .split('-')
  .map((el) => el[0].toUpperCase() + el.slice(1))
  .join('');

module.exports = {
  pluginName,
  packageName,
};
