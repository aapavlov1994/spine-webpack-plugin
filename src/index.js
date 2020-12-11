const Plugin = require('./Plugin');

const loader = require.resolve('./loader/index.js');

module.exports = {
  Plugin,
  loader,
};
