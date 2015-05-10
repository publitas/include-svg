# Include SVG

### This is WIP!

Get all svg files in a (nested) folder as a javascript object. Uses [SVGO](https://github.com/svg/svgo) to optimize the files first.

## Usage

Currently only a stream interface is supported. Examples:

```
includeSvg('test/files').pipe(process.stdout)
```

```
var buffer = '';
includeSvg('test/files')
  .on('data', function (chunk) { buffer += chunk; })
  .on('end'), function () {
    var svgFiles = JSON.parse(buffer);

    ...
  })
```
