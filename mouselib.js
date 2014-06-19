var $ = require('NodObjC')
$.framework('Foundation')
$.framework('CoreGraphics')

// var pool = $.NSAutoreleasePool('alloc')('init');
// pool('drain');

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


function moveMouseToPosition (X, Y) {
  var mouse = $.CGEventCreateMouseEvent(null, $.kCGEventMouseMoved, $.CGPointMake( X, Y), 0);
  $.CGEventPost($.kCGHIDEventTap, mouse);
}

function getMouseLocation () {
  var mouseEvent = $.CGEventCreate(null);
  var point = $.CGEventGetLocation(mouseEvent);
  return point;
}

function Mouse () {}

Mouse.prototype.move = moveMouseToPosition;

Mouse.prototype.location = getMouseLocation;

module.exports = new Mouse();