var includeSvg = require('../');
var through = require('through2');
var test = require('tap').test;

test('includeSvg streaming', function(t) {
  var buffer = '';
  function write(chunk, _, cb) { buffer += chunk; cb(); }

  t.plan(4);

  includeSvg('test/files').pipe(through(write, function() {
    var svgFiles = JSON.parse(buffer);
    var filenNames = Object.keys(svgFiles);

    t.equal(filenNames.length, 3);
    t.ok(filenNames.indexOf('svg-file') !== -1);
    t.ok(filenNames.indexOf('some other') !== -1);
    t.ok(filenNames.indexOf('nested/svg-file') !== -1);
    t.end();
  }));
});
