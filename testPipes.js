var spawn = require('child_process').spawn;
var cmd = spawn('/usr/local/bin/tessel', ['run', './data_source/index.js'], console.log);

cmd.stdout.on('data', function(data) {
  console.log(data.toString());
});
