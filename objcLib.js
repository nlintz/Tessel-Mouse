var $ = require('NodObjC')
$.framework('Foundation')
$.framework('CoreGraphics')
$.framework('AppKit')
/**
  There are two ways to access objc functions - c calls or objective c message passing
  
  The node objC library exposes both (thanks to @TooTallNate For writing the beautiful NodObjC Lib)
  Full API Docs for NodObjC can be found here: http://tootallnate.github.io/NodObjC/

  Remember to import the correct libraries, we're using Foundation and Core Graphics in this example

  Example: C Calls
  Obj C: CGPoint CGPointMake (NSInteger X, NSInteger Y); -> Returns CGPoint struct
  JS: $.CGPointMake(X, Y); -> Returns point object

  Example: Obj C Message Passing
  Obj C: NSString *string = [NSString stringWithUTF8String: @"Hello Objective-C World!"]
  JS: var string = $.NSString('stringWithUTF8String', 'Hello Objective-C World!')

  In General you use: object('messageNameWithArg', someArg, 'andArg', anotherArg)
    Even args are the labels, odd args are the actual arguments

**/

function Mouse () {};
function Screen () {};

Mouse.prototype.move = function (X, Y) {
  var mouse = $.CGEventCreateMouseEvent(null, $.kCGEventMouseMoved, $.CGPointMake( X, Y), 0);
  $.CGEventPost($.kCGHIDEventTap, mouse);
}

Mouse.prototype.location = function () {
  var mouseEvent = $.CGEventCreate(null);
  var point = $.CGEventGetLocation(mouseEvent);
  return point;
};

Mouse.prototype.press = function (pressType) {
  var location = this.location()
  if (pressType == "press") {
    var mouseEv = $.CGEventCreateMouseEvent(null, $.kCGEventLeftMouseDown, location, $.kCGMouseButtonLeft);
  } else if (pressType == "release") {
    var mouseEv = $.CGEventCreateMouseEvent(null, $.kCGEventLeftMouseUp, location, $.kCGMouseButtonLeft);
  }
  $.CGEventPost($.kCGHIDEventTap, mouseEv);
}

Screen.prototype.windowSize = function () {
  var id = $.CGMainDisplayID();
  var width = $.CGDisplayPixelsWide(id)
  var height = $.CGDisplayPixelsHigh(id)
  return {width:width, height:height};
}

exports.Mouse = new Mouse();
exports.Screen = new Screen();