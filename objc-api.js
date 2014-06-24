// var $ = require('NodObjC')
// $.framework('Cocoa');

// var pool = $.NSAutoreleasePool('alloc')('init')
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

var objcLib = require('./obj-clib/')

function Mouse () {};
function Screen () {};

Mouse.prototype.move = function (X, Y) {
  objcLib.moveMouse(parseInt(X, 10), parseInt(Y, 10));
}

Mouse.prototype.press = function (pressType) {
  if (pressType == "press") {
    objcLib.mousePress();
  } else if (pressType == "release") {
    objcLib.mouseRelease();
  }
}

Screen.prototype.windowSize = function () {
  var width = objcLib.windowWidth();
  var height = objcLib.windowHeight();
  return {width:width, height:height};
}

exports.Mouse = new Mouse();
exports.Screen = new Screen();