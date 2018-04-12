# broccoli-jscodeshift [![Build Status](https://travis-ci.org/alexlafroscia/broccoli-jscodeshift.svg?branch=master)](https://travis-ci.org/alexlafroscia/broccoli-jscodeshift)

## Installation

```bash
yarn add broccoli-jscodeshift
```

## Usage

```javascript
// Brocfile.js
const JSCodeShift = require('broccoli-jscodeshift');

module.export = new JSCodeShift(['./src'], {
  transform: 'https://raw.githubusercontent.com/mikaelbr/rm-debugger/master/index.js'
});
```

### Arguments

```txt
input              : (required) The input node, either a Broccoli tree or array of strings
options
  .transform       : (required) A path to the transform to execute
  .resultsCallback : (optional) A callback to execute with the results from JSCodeShift`
```
