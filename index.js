var $ = require('NodObjC')
$.framework('Foundation')
$.framework('CoreGraphics')

var pool = $.NSAutoreleasePool('alloc')('init');


pool('drain');

function moveMouseToPosition(X, Y)
{
  var mouse = $.CGEventCreateMouseEvent(null, $.kCGEventMouseMoved, $.CGPointMake( X, Y), 0);
  $.CGEventPost($.kCGHIDEventTap, mouse);
}

function getMouseLocation() 
{
  var mouseEvent = $.CGEventCreate(null);
  var point = $.CGEventGetLocation(mouseEvent);
  return point;
}