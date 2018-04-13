const path = require('path');

const Plugin = require('broccoli-caching-writer');
const Runner = require('jscodeshift/src/Runner');
const fs = require('fs-extra');

const logCopy = require('debug')('broccoli-jscodeshift:copy');
const logTransform = require('debug')('broccoli-jscodeshift:transform');

function isEmptyInputError(error) {
  return (
    error.message ===
    "Cannot read property 'Symbol(Symbol.iterator)' of undefined"
  );
}

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

    const from = path.join(basePath, relativePath);
    const to = path.join(this.outputPath, relativePath);
    logCopy('Copying %o to %o', from, to);

    fs.copySync(from, to, { dereference: true });
  }

  logTransform('Running %o on %o', this.transform, this.outputPath);

  return Runner.run(this.transform, [this.outputPath], {
    verbose: 0,
    babel: true,
    extensions: 'js',
    silent: true,
    parser: 'babel'
  })
    .then(this.resultsCallback)
    .catch(error => {
      // JSCodeShift will throw an error when the node is empty. We don't actually care.
      if (isEmptyInputError(error)) {
        return;
      }

      throw error;
    });
};

module.exports = JSCodeShift;
