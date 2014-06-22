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

  this.xPosition = 0;
  this.yPosition = 0;
  this.xVelocity = 0;
  this.yVelocity = 0;
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
  var xRaw = parseFloat(data[0].toFixed(2));
  var yRaw = parseFloat(data[1].toFixed(2));

  var xFiltered = this._lowPass(xRaw, "prevXReadings");
  var yFiltered = this._lowPass(yRaw, "prevYReadings");

  // Convert Accelerometer Readings to a Velocity
  var xVelocity = xFiltered.map(-1, 1, 0, 5);
  var yVelocity = yFiltered.map(-1, 1, 0, 5);

  // var xPos = xFiltered.map(-1, 1, 0, this.screenWidth);
  // var yPos = yFiltered.map(-1, 1, 0, this.screenHeight);

  mouse.move(xPos, yPos);
};

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