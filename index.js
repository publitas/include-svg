var rd = require('read-dir-files');
var through = require('through2');
var SVG = require('svgo');
var path = require('path');
var fs = require('fs');
var svg = new SVG();

module.exports = function(dirPath) {
  var stream = through();
  var first = true;
  var done = false;
  var processing = 0;

  rd.list(dirPath)
    .on('error', function(err) { throw err; })
    .on('end', function() { done = true; })
    .on('file', function(filePath) {
      if (path.extname(filePath) !== '.svg') return;
      processing++;

      optimize(filePath, function(res) {
        var key = path.relative(dirPath, filePath).replace(/\.svg$/, '');

        stream.push(first ? '{' : ',');
        stream.push('"'+key+'": '+JSON.stringify(res.data));
        first = false;
        processing--;

        if (processing === 0 && done) {
          stream.push('}');
          stream.push(null);
        }
      });
    });

  return stream;
};

function optimize(filePath, callback) {
  fs.readFile(filePath, function(err, content) {
    if (err) throw err;
    svg.optimize(content.toString(), callback);
  });
}
