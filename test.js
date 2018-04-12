import test from 'ava';
import td from 'testdouble';

import path from 'path';
import fs from 'fs';
import Fixturify from 'broccoli-fixturify';
import broccoli from 'broccoli';

import JSCodeShift from './';

let builder;

test.afterEach.always(function() {
  if (builder) {
    builder.cleanup();
  }
});

test.serial('it works on a Broccoli node', async function(t) {
  const inputNode = new Fixturify({
    'foo.js': `
      module.exports = function() {
        debugger;
      }
    `
  });

  const transformed = new JSCodeShift(inputNode, {
    transform:
      'https://raw.githubusercontent.com/mikaelbr/rm-debugger/master/index.js'
  });

  builder = new broccoli.Builder(transformed);
  await builder.build();

  const contents = fs.readFileSync(builder.outputPath + '/foo.js', {
    encoding: 'utf8'
  });

  t.falsy(contents.includes('debugger'));
});

test.serial('it works on an array of nodes', async function(t) {
  const inputNode = new Fixturify({
    'foo.js': `
      module.exports = function() {
        debugger;
      }
    `
  });

  const transformed = new JSCodeShift([inputNode], {
    transform:
      'https://raw.githubusercontent.com/mikaelbr/rm-debugger/master/index.js'
  });

  builder = new broccoli.Builder(transformed);
  await builder.build();

  const contents = fs.readFileSync(builder.outputPath + '/foo.js', {
    encoding: 'utf8'
  });

  t.falsy(contents.includes('debugger'));
});

test.serial('it works on a relative string node', async function(t) {
  const transformed = new JSCodeShift('./fixtures/basic', {
    transform:
      'https://raw.githubusercontent.com/mikaelbr/rm-debugger/master/index.js'
  });

  builder = new broccoli.Builder(transformed);
  await builder.build();

  const outputContent = fs.readFileSync(builder.outputPath + '/index.js', {
    encoding: 'utf8'
  });

  t.falsy(outputContent.includes('debugger'));

  const originalContent = fs.readFileSync(
    path.join(process.cwd(), './fixtures/basic/index.js'),
    {
      encoding: 'utf8'
    }
  );

  t.truthy(originalContent.includes('debugger'));
});

test.serial('it works with an absolute string node', async function(t) {
  const transformed = new JSCodeShift(
    path.join(process.cwd(), './fixtures/basic'),
    {
      transform:
        'https://raw.githubusercontent.com/mikaelbr/rm-debugger/master/index.js'
    }
  );

  builder = new broccoli.Builder(transformed);
  await builder.build();

  const outputContent = fs.readFileSync(builder.outputPath + '/index.js', {
    encoding: 'utf8'
  });

  t.falsy(outputContent.includes('debugger'));

  const originalContent = fs.readFileSync(
    path.join(process.cwd(), './fixtures/basic/index.js'),
    {
      encoding: 'utf8'
    }
  );

  t.truthy(originalContent.includes('debugger'));
});

test.serial('it can invoke a callback after processing', async function() {
  const cb = td.function();
  const inputNode = new Fixturify({
    'foo.js': `
      module.exports = function() {
        debugger;
      }
    `
  });

  const transformed = new JSCodeShift(inputNode, {
    transform:
      'https://raw.githubusercontent.com/mikaelbr/rm-debugger/master/index.js',
    resultsCallback: cb
  });

  builder = new broccoli.Builder(transformed);
  await builder.build();

  td.verify(cb(td.matchers.argThat(result => result.error === 0)), {
    times: 1
  });
  td.verify(cb(td.matchers.argThat(result => result.skip === 0)), {
    times: 1
  });
  td.verify(cb(td.matchers.argThat(result => result.nochange === 0)), {
    times: 1
  });
  td.verify(cb(td.matchers.argThat(result => result.ok === 1)), {
    times: 1
  });
});
