var spawn = require('child_process').spawn;
var tessel = require('tessel');
var cmd = spawn('/usr/local/bin/tessel', ['run', './data_source/index.js'], {stdio:'pipe'});
var objcLib = require('./objcLib');
var mouse = objcLib.Mouse;
var screen = objcLib.Screen;

var mouseHandler = new MouseHandler();

cmd.stdout.on('data', function(message) {
  mouseHandler._parseMessage(message.toString());
});

Number.prototype.map = function (amin, amax, bmin, bmax) {

  return (this - amin) * (bmax - bmin) / (amax - amin) + bmin;
};

Array.prototype.zeros = function () {
  return Array.apply(null, new Array(5)).map(Number.prototype.valueOf,0);
}

function MouseHandler () {
  var screenDimensions = screen.windowSize();
  this.xBounds = screenDimensions.width;
  this.yBounds = screenDimensions.height;

  this.xPosition = this.xBounds / 2;
  this.yPosition = this.yBounds / 2;
};

MouseHandler.prototype._handler = function (type) {
  var handlers = {
    'accelerometer': this._handleAccelerometer.bind(this),
    'mouseEvent': this._handleMouseEvent.bind(this),
    'error': this._handleError.bind(this)
  };
  return handlers[type];
};

MouseHandler.prototype._parseMessage = function (message) {

  if (typeof message == 'string') {
    try {
      var message = JSON.parse(message);
    } catch (e) {
      console.log("ERROR: ", e, "Message: ", message);
      message = {type:"error", args:{message:message}}
    }
  }

  var type = message.type;

  if ("args" in message) {
    var args = message.args;
  }

  this._handler(type)(args);
};

// From http://www.control.com/thread/1026171199
MouseHandler.prototype._lowPass = function (value, attr) {
  var numTerms = 5; // Number of terms in LPF
  var a = 1 / 16;
  var b = 1 / 4;
  var c = 3 / 8;

  if (!(attr in this)) {
    this[attr] = new Array().zeros(numTerms);
  }

  this[attr].unshift(value);
  this[attr].pop();

  var prevValues = this[attr];
  var avg = (a * prevValues[0]) + (b * prevValues[1]) + (c * prevValues[2]) + (b * prevValues[3]) + (a * prevValues[4]);

  return avg;
};

MouseHandler.prototype._handleAccelerometer = function (args) {
  var data = args.data;
  var positionScalar = 50;

  var xRaw = parseFloat(data[0].toFixed(2));
  var yRaw = parseFloat(data[1].toFixed(2));

  this.xPosition += checkBounds(this.xPosition, this._getVelocity(xRaw, "x", positionScalar), this.xBounds);
  this.yPosition += checkBounds(this.yPosition, this._getVelocity(yRaw, "y", positionScalar), this.yBounds);

  mouse.move(this.xPosition, this.yPosition);
};

MouseHandler.prototype._getVelocity = function (reading, dataTag, positionScalar) {
  
  var filteredData = this._lowPass(reading, 'prevReading' + dataTag);
  var velocity = filteredData.map(-1, 1, -1 * positionScalar, positionScalar);
  return velocity;

}

MouseHandler.prototype._handleMouseEvent = function (args) {

  if (args == "press") {
    mouse.press("press")
  } else if (args == "release") {
    mouse.press("release");
  }
};

MouseHandler.prototype._handleError = function (args) {
  console.log("Error parsing:", args.message)
};

function checkBounds(position, velocity, bounds) {
  if (((position + velocity) > bounds && velocity > 0) || ((position + velocity) < 0 && velocity < 0)) {
    console.log('bounds reached')
    return 0;
  } else {
    return velocity;
  }
}