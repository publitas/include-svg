var rd = require('read-dir-files');
var through = require('through2');
var SVG = require('svgo');
var path = require('path');
var traverse = require('traverse');

module.exports = function(dirPath) {
  var stream = through();
  rd.read(dirPath, 'utf8', true, function(err, contents) {
    if (err) {
      return stream.push('{}');
    }
    stream.push('{');
    optimize(contents, stream, function() {
      stream.push('}');
      stream.push(null);
    });
  });

  return stream;
};

function optimize(contents, stream, callback) {
  var svg = new SVG();
  var files = traverse(contents);
  var filePaths = files.paths();
  var visited = 0;
  var first = true;

  function checkDone() {
    visited++;
    if (visited === filePaths.length) callback();
  }

  filePaths.forEach(function(filePath) {
    var fileName = filePath[filePath.length-1];
    var keyName;

    if (path.extname(fileName) === '.svg') {
      keyName = keyNameForPath(filePath);

      svg.optimize(files.get(filePath), function(res) {
        if (!first) stream.push(',\n'); first = false;

        stream.push('"'+keyName+'": '+JSON.stringify(res.data));
        checkDone();
      });
    } else {
      checkDone();
    }
  });

  function keyNameForPath(filePath) {
    var fileName = filePath[filePath.length-1];

    return filePath
      .slice(0, -1)
      .concat(path.basename(fileName, '.svg'))
      .join('/');
  }
}

