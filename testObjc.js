var $ = require('NodObjC');
var objcLib = require('./objcLib');
var mouse = objcLib.Mouse;

// var pool = $.NSAutoreleasePool('alloc')('init')

var count = 0;

setInterval(function () {
  console.log(count++);
  mouse.move();
}, .00000000001)

// pool('drain');