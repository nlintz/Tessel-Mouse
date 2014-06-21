var spawn = require('child_process').spawn;
var cmd = spawn('/usr/local/bin/tessel', ['run', './accelerometer/index.js'], console.log);

cmd.stdout.on('readable', function () {
  console.log('readable')
});

cmd.stdout.on('data', function(data) {
  console.log(data.toString());
});
