module.exports = function getSpineMap(object) {
  const { width: spriteWidth, height: spriteHeight } = object.properties;
  const output = [];
  output.push(
    `size: ${spriteWidth},${spriteHeight}`,
    'format: RGBA8888',
    'filter: Linear,Linear',
    'repeat: none',
  );

  Object.keys(object.coordinates).forEach((key) => {
    const {
      x,
      y,
      width,
      height,
    } = object.coordinates[key];
    output.push(
      `${key.slice(0, -4)}`,
      '  rotate: false',
      `  xy: ${x}, ${y}`,
      `  size: ${width}, ${height}`,
      `  orig: ${width}, ${height}`,
      '  offset: 0, 0',
      '  index: 0',
    );
  });

  const outputString = output.reduce((prev, curr) => `${prev}\n${curr}`, 'sprite.png');

  return `module.exports = \`\n${outputString}\n\`;`;
};
