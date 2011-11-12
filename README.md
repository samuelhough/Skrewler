# jQuery Skrewler
A plugin for scrolling list elements horizontally or vertically.

## Usage

Add the following to your html file:
<!---->
    <script src="jquery.skrewler.min.js"></script>
    <script>
    $('#scroller').skrewler({ direction: "horizontal", leftUpButtonID: '#left', rightDownButtonID: '#right'});
    </script>

This call skrewler on your list, tells it whether the list should scroll horizontally or vertically, and defines the ids for your left/right or up/down buttons.

### Required

<!---->
    direction: "horizontal" || "vertical"  // Direction skrewler will scroll your UL element

### Required (if enableKeys === false)
<!---->
    leftUpButtonID: "#id"     // Selector ID for the left/Up button on your page
    rightDownButtonID: "#id"  // Selector ID for the right/Down button on your page

### Optional
<!---->
    duration: (int)               // How long the animations last
    reverse: (boolean)            // Reverse the direction of the button / keyboard presses
    enableKeys: (boolean)         // Enable keyboard control
    keyCode_left: (int)           // Specify a different key code value to cause the list to move left
    keyCode_right: (int)          // Specify a different key code value to cause the list to move right
    keyCode_up: (int)             // Specify a different key code value to cause the list to move up
    keyCode_down: (int)           // Specify a different key code value to cause the list to move down
    postAnimFunc: function(){}    // Pass a function to be performed at the end of every scroll animation
    leaveBoundsFunc: function(){} // Pass a function to be performed when the user tries to go outside a boundary (left or right/up down side)
    scrollByPageSize: (boolean)   // Instead of scrolling by the average li elements width, scroll by the page width or height
 

## License
Copyright (c) 2011 Samuel Hough

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Contributors
Chris Abrams