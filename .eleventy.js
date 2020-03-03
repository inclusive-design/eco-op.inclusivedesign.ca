// Import transforms
const htmlMinTransform = require('./src/transforms/html-min-transform.js');
const parseTransform = require('./src/transforms/parse-transform.js');

// Import data files
const site = require('./src/_data/site.json');

module.exports = function(config) {
  // Layout aliases
  config.addLayoutAlias('base', 'layouts/base.njk');

  // Transforms
  // config.addTransform('htmlmin', htmlMinTransform);
  config.addTransform('parse', parseTransform);

  // Passthrough copy
  config.addPassthroughCopy('src/images');
  config.addPassthroughCopy('src/styles.css');
//   config.addPassthroughCopy('src/admin/config.yml');
//   config.addPassthroughCopy('src/admin/previews.js');
//   config.addPassthroughCopy('node_modules/nunjucks/browser/nunjucks-slim.js');

  return {
    dir: {
      input: 'src',
      output: 'dist'
    },
    passthroughFileCopy: true
  };
};
