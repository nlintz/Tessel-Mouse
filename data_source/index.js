var tessel = require('tessel');
var accel = require('accel-mma84').use(tessel.port['A']); // Replace '../' with 'accel-mma84' in your own code
process.stdout.write('process started')


// Initialize the accelerometer.
accel.on('ready', function () {
  sendMessage(DataTypes.ready);
  accel.enableDataInterrupts(false, function () {
    accel.setOutputRate(800, function rateSet() {
      accel.on('data', function (xyz) {
        sendMessage(DataTypes.accelerometer, {data: xyz})
      });
    });
  })
});

accel.on('error', function(err){
  console.log('Error:', err);
});

tessel.button.on('press', function(time) {
  sendMessage(DataTypes.mouseEvent, 'press');
});

tessel.button.on('release', function(time) {
    sendMessage(DataTypes.mouseEvent, 'release');
});

// Sends message to stdout
function sendMessage (type, args) {
  console.log(Message(type, args));
}


function Message (type, args) {
  if (!args) {
    args = {};
  };

  return JSON.stringify({type: type, args: args});
};

var DataTypes = {
  accelerometer: 'accelerometer',
  mouseEvent: 'mouseEvent',
  ready: 'ready'
};