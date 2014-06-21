var tessel = require('tessel');
var mouse = require('./mouselib');
var mouseHandler = new MouseHandler()

tessel.findTessel(null, function (err, client) {
    client.listen(true, [10, 11, 12, 13, 20, 21, 22])
    if (err) {
      console.error('No tessel connected, aborting:', err);
      process.exit(1);
    }
    
    client.on('error', function (err) {
      console.error('Error: Cannot connect to Tessel locally.', err);
    })

    client.on('message', function (data) {
      mouseHandler.getData(data, mouseHandler.handleData);
    });

    // Bundle and upload code.
    client.run('./accelerometer/index.js', ['tessel', ''], {
    }, function (err, bundle) {
      console.log('Mouse ... ON!')
      // When this script ends, stop the client.
      process.on('SIGINT', function() {
        client.once('script-stop', function (code) {
          process.exit(code);
        });
        setTimeout(function () {
          // timeout :|
          process.exit(code);
        }, 5000);
        client.stop();
      });
    });
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

MouseHandler.prototype.getData = function (data, callback) {
  if (typeof data == "string") {
    handleClick(data)
  } else {
    var x = this.lowPass(parseFloat(data[0].toFixed(2)), 'previousXAcc');
    var y = this.lowPass(parseFloat(data[1].toFixed(2)), 'previousYAcc');
    callback ({
      xAcceleration: x,
      yAcceleration: y
    })
  }
};

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
  mouse.move(data.xAcceleration.map(-1, 1, 0, 1440+200), data.yAcceleration.map(-1, 1, 0, 900+100));
  // var x = mouse.location().x;
  // var y = mouse.location().y;
  // interpolate(x, parseFloat(data.xAcceleration).map(-1, 1, 0, 1440), y, parseFloat(data.yAcceleration).map(-1, 1, 0, 900), mouse.move);
}