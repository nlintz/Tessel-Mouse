var tessel = require('tessel');
var accel = require('accel-mma84').connect(tessel.port['A']);
var mouse = require('./mouselib');
var path = require('path')
