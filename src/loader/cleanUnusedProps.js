/* eslint-disable no-param-reassign */
module.exports = function cleanUnusedProps(config, usedAnims) {
  // clean unused animations
  if (usedAnims) {
    const usedEvents = new Set();
    Object.keys(config.animations).forEach((key) => {
      if (!usedAnims.includes(key)) delete config.animations[key];
      else config.animations[key].events.forEach(({ name }) => { usedEvents.add(name); });
    });
    // clean unused events
    Object.keys(config.events).forEach((key) => {
      if (!usedEvents.has(key)) delete config.events[key];
    });
  }
};
/* eslint-enable no-param-reassign */
