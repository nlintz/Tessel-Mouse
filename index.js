var tessel = require('tessel');
var mouse = require('./mouselib');
var mouseHandler = new MouseHandler()

var spawn = require('child_process').spawn;
var cmd = spawn('/usr/local/bin/tessel', ['run', './data_source/index.js'], console.log);

cmd.stdout.on('data', function(data) {
  console.log(data.toString());
});


function MouseHandler () {
  this.previousXAcc = 0;
  this.previousYAcc = 0;
}

Number.prototype.map = function (amin, amax, bmin, bmax) {
  return ( this - amin ) * ( bmax - bmin ) / ( amax - amin ) + bmin;
}

MouseHandler.prototype.lowPass = function (newValue, attr) {
  var oldValue = this[attr];
  var avg = (newValue + oldValue)/2;
  this[attr] = avg;
  return avg;
} 

// MouseHandler.prototype.getData = function (data, callback) {
//   if (typeof data == "string") {
//     handleClick(data)
//   } else {
//     var x = this.lowPass(parseFloat(data[0].toFixed(2)), 'previousXAcc');
//     var y = this.lowPass(parseFloat(data[1].toFixed(2)), 'previousYAcc');
//     callback ({
//       xAcceleration: x,
//       yAcceleration: y
//     })
//   }
// };

MouseHandler.prototype.parseData = function (data) {
  var data = JSON.parse(data);
  // console.log('data:', data.data, 'datatype:', typeof data.data);
  // if (data.type == "accelerometer") {
  //   console.log(data.args)
  // }
}

function interpolate (xStart, xEnd, yStart, yEnd, callback) {
  var currentX = xStart;
  var currentY = yStart;

  var interval = setInterval(function () {
    if (currentX == xEnd && currentY == yEnd) {
      clearInterval(interval);
    } else {
      currentX = Math.min(currentX + 5, xEnd);
      currentY = Math.min(currentY + 5, yEnd);
      callback(currentX, currentY);
    }
  }, 1)
}

function handleClick (direction) {
  mouse.mousePress(direction);
}

MouseHandler.prototype.handleData = function (data) {
  // mouse.move(data.xAcceleration.map(-1, 1, 0, 1440+200), data.yAcceleration.map(-1, 1, 0, 900+100));
  // var x = mouse.location().x;
  // var y = mouse.location().y;
  // interpolate(x, parseFloat(data.xAcceleration).map(-1, 1, 0, 1440), y, parseFloat(data.yAcceleration).map(-1, 1, 0, 900), mouse.move);
}