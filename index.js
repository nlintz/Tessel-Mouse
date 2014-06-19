var mouse = require('./mouselib');


function moveMouseDiagonalTest () {
  var location = mouse.location()
  var i = 0;

  setInterval(function() {
    mouse.move((location.x + i), (location.y + i));
    i += 1;
  }, 100);
}