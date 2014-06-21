var tessel = require('tessel');
var accel = require('accel-mma84').use(tessel.port['A']); // Replace '../' with 'accel-mma84' in your own code
process.stdout.write('process started')

// Initialize the accelerometer.
accel.on('ready', function () {
    accel.enableDataInterrupts(false, function () {
      accel.setOutputRate(200, function rateSet() {
        accel.on('data', function (xyz) {
          console.log(xyz);
        });
      });

    })
});

accel.on('error', function(err){
  console.log('Error:', err);
});

tessel.button.on('press', function(time) {
  console.log('press');
});

tessel.button.on('release', function(time) {
    console.log('release');
});