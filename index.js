const path = require('path');

const Plugin = require('broccoli-caching-writer');
const Runner = require('jscodeshift/src/Runner');
const fs = require('fs-extra');

JSCodeShift.prototype = Object.create(Plugin.prototype);
JSCodeShift.prototype.constructor = JSCodeShift;
function JSCodeShift(inputNodes, options = {}) {
  if (!Array.isArray(inputNodes)) {
    inputNodes = [inputNodes];
  }

  this.transform = options.transform;
  this.resultsCallback = options.resultsCallback || function() {};

  Plugin.call(this, inputNodes, {
    annotation: options.annotation
  });
}

JSCodeShift.prototype.build = function() {
  for (let { relativePath, basePath } of this.listEntries()) {
    if (!path.isAbsolute(basePath)) {
      basePath = path.join(process.cwd(), basePath);
    }

    fs.copySync(
      path.join(basePath, relativePath),
      path.join(this.outputPath, relativePath)
    );
  }

  return Runner.run(this.transform, [this.outputPath], {
    verbose: 0,
    babel: true,
    extensions: 'js',
    silent: true,
    parser: 'babel'
  }).then(this.resultsCallback);
};

module.exports = JSCodeShift;
