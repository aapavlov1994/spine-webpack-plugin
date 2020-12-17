const options = ['animations', 'scale', 'skins'];

module.exports = function getOptions() {
  const output = {};
  options.forEach((name) => {
    output[name] = (this.getOptions && this.getOptions()[name])
    || (typeof this.resourceQuery === 'string'
      && this.resourceQuery !== ''
      && JSON.parse(this.resourceQuery.replace(/^\?/, ''))[name])
    || (typeof this.query === 'object' && this.query[name]); // webpack4
  });

  return output;
};
