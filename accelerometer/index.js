// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
This basic accelerometer example logs a stream
of x, y, and z data from the accelerometer
*********************************************/

var tessel = require('tessel');
var accel = require('accel-mma84').use(tessel.port['A']); // Replace '../' with 'accel-mma84' in your own code
process.stdout.write('process started')
console.log('process started')
var click = false;
// Initialize the accelerometer.
accel.on('ready', function () {
    // Stream accelerometer data
    // accel.on('data', function (xyz) {
    //     sendMessage(xyz);
    //   }
    accel.enableDataInterrupts(false, function () {
      accel.setOutputRate(200, function rateSet() {
        accel.on('data', function (xyz) {
          if (!click)
            sendMessage(xyz);
        });
      });

    })
});

accel.on('error', function(err){
  console.log('Error:', err);
});

tessel.button.on('press', function(time) {
  sendMessage('press');
  console.log('hi')
});

tessel.button.on('release', function(time) {
  sendMessage('release');
});

function sendMessage(message) {
  process.send(message);
}