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
  transform: '...' // Some path to a codemod hosted somewhere
});
```

### Arguments

`input` : The input node, either a Broccoli tree or array of strings
`options`
`options.tranform` : A path to the transform to execute
`options.resultsCallback` : (optional) A callback to execute with the results from JSCodeShift
