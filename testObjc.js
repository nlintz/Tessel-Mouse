var objcLib = require('./objcLib');
var mouse = objcLib.Mouse;

var count = 0;

setInterval(function () {
  console.log(count++);
  // mouse.move(mouse.location().x, mouse.location().y);
  mouse.move(1, 1);
}, .00000000001)