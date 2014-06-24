var ffi = require('ffi')
var path = require('path')
var libTesselObjC = ffi.Library(path.resolve(__dirname, './TesselObjCLib'), {
  'moveMouse': [ 'void', ['int', 'int'] ],
  'mousePress': ['void', [] ],
  'mouseRelease': ['void', [] ],
  'windowHeight': ['size_t', [] ],
  'windowWidth': ['size_t', [] ]
});

module.exports = libTesselObjC;