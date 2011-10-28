/* 
 
 Skrewler - A Jquery plugin for scrolling floated, unordered list elements vertically and horizontally
 Alpha 1.0
 Created by Sam Hough with code inspiration from Chris Abrams

 Open Source - MIT Licesnse 
 October 2011

 To use - call skrewler on your unorganized list, say whether it should scroll vertically or horizontall, and give the ids for your left/right or up/down
 buttons
 EX: $('#scroller').skrewler({ direction: "horizontal", leftUpButtonID: '#left', rightDownButtonID: '#right'});

 Skrewler Options: 
    REQUIRED: 
        direction: "horizontal" || "vertical" - Direction skrewler will scroll your UL element
    
    REQUIRED (if enableKeys === false):
        leftUpButtonID: "#id"                 - Selector ID for the left/Up button on your page
        rightDownButtonID: "#id"              - Selector ID for the right/Down button on your page
    
    Optional:
        duration: (int)              - How long the animations last
        reverse: (boolean)           - Reverse the direction of the button / keyboard presses
        enableKeys: (boolean)        - Enable keyboard control
        keyCode_left: (int)          - Specify a different key code value to cause the list to move left
        keyCode_right: (int)         - Specify a different key code value to cause the list to move right
        keyCode_up: (int)            - Specify a different key code value to cause the list to move up
        keyCode_down: (int)          - Specify a different key code value to cause the list to move down
        postAnimFunc: function(){}   - Pass a function to be performed at the end of every scroll animation
        leaveBoundsFunc: function(){}- Pass a function to be performed when the user tries to go outside a boundary (left or right/up down side)
        scrollByPageSize: (boolean)  - Instead of scrolling by the average li elements width, scroll by the page width or height
 
// ----------------------------------------------------------------------------// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files ( the "Software" ), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE. 
// ----------------------------------------------------------------------------//      
*/

(function($) {
    $.fn.skrewler = function(options){
       
       // Error Reporting Object
       var error = {
           e: "Skrewler ERROR: ",
           noDirection: function(){
               console.log(this.e + "No direction was provided to the handler - $('#yourElement').skrewler({ direction: 'vertical' (or) 'horizontal' ");
           
           },
           leftUp: function(){
               console.log(this.e + "No id for leftUpButtonID && enableKeys === false   FIX:  $('#yourElement').skrewler({ leftUpButtonID: '#id'");
           
           },
           rightDown: function(){
               console.log(this.e + "No id for rightDownButtonID && enableKeys === false  FIX:  $('#yourElement').skrewler({ rightDownButton: '#id'");           
           }
       };
       
       // Contains the parameters passed by the client in calling $(element).skrewler({ });
       var defaults = {
            direction: "",                  // Required
            
            leftUpButtonID: '',             // Required if enableKeys is false
            rightDownButtonID: '',          // Required if enableKeys is false
            
            duration: 800,
            reverse: false,
            enableKeys: false,
            keyCode_left: 37,
            keyCode_right: 39,
            keyCode_up: 38,
            keyCode_down: 40,
            postAnimFunc: function(){},
            leaveBoundsFunc:      function(){},
            scrollByPageSize: false,
            
            _this: null
       };
       defaults = $.extend(defaults, options);
       defaults._this = this;
       
        
       // Main object for skrewler functionality
       var skrewler = {
           wHeight: 0,
           wWidth: 0, 

           element: {},                           // Element that is being manipulated
           position: 0,                           // Keeps track of the list's position and is multiplied by the scrollLength to set the xPos/yPos
           xPos: 0,                               // marginLeft size in horizontal scrolling   
           yPos: 0,                               // marginTop  size in vertical scroling
           atBoundary: false,                     // If (atBoundary) and the user tries to go past it, the defaults.leaveBoundsFunc() is called
           init: function(obj){
                this.wHeight = $(window).height();
                this.wWidth  = $(window).width();
                this.element = obj;
                
                //Initialization error checking
                if(defaults.direction === ''){
                     error.noDirection();
                }
                if(defaults.leftUpButtonID === '' && defaults.enableKeys === false){
                     error.leftUp();
                }
                if(defaults.rightDownButtonID === '' && defaults.enableKeys === false){
                    error.rightDown();
                }
                
           },
           scroll: function(direction){                // Called by event handlers and passed the direction the element should move
               if(defaults.reverse === true){          // Reverse scroll direction of skrewler if defaults.reverse === true
                    switch(direction){
                        case "left":
                            direction = "right";
                            break;
                        case "right":
                            direction = "left";
                            break;
                        case "up":
                            direction = "down";
                            break;
                        case "down":
                            direction = "up";
                            break;
                    }   
               }
               
               switch(direction){                     // Send the scroll call to the appropriate function
                   case "left":
                       this.scrollLeft();
                       break;
                   case "right":
                       this.scrollRight();
                       break;
                   case "up":
                       this.scrollUp();
                       break;
                   case "down":
                       this.scrollDown();
                       break;
                   default:
                       console.log(error.e + ' No valid direction was passed to skrewler.scroll(direction)');
                       break;
               }
           },
           scrollLeft: function(){      // Scroll the element left
                
                this.wWidth = $(window).width();                                                    // Width of Window
                
                var totalWidth = 0;
                $(this.element).find("li").each(function(){                                         // Total size of all elements combined 
                    totalWidth += $(this).outerWidth(true);
                });
                
                var elements      = $(this.element).find("li").length,                              // Get total # of elements in list                      
                    scrollLength  = parseInt(totalWidth / elements, 10);                            // Determine the length each scroll click should be
                
                if(defaults.scrollByPageSize){ 
                    scrollLength = this.wWidth; 
                 }
                
                if(((this.position - 1) * scrollLength) >=  (-totalWidth  + this.wWidth)){
                    this.position -= 1;
                    this.xPos      = this.position * scrollLength;
                } else {
                    if(this.atBoundary){ 
                        defaults.leaveBoundsFunc();
                    }
                    this.xPos      = (-totalWidth  + this.wWidth);
                    this.atBoundary = true;
                }
                
                $(this.element).stop().animate({
                    marginLeft: this.xPos
                }, defaults.duration, function(){
                    defaults.postAnimFunc();
                }); 
                
           },
           scrollRight: function(){      // Scroll the element right
               
               
                this.wWidth = $(window).width();                                                     // Width of Window
                
                var totalWidth = 0;
                $(this.element).find("li").each(function(){                                          // Total size of all elements combined with margin
                    totalWidth += $(this).outerWidth(true);
                });
                
                var elements      = $(this.element).find("li").length,                               // Get total # of elements in list                     
                    scrollLength  = parseInt(totalWidth / elements, 10);                             // Determine the length each scroll click should be
                
                if(defaults.scrollByPageSize){ 
                    scrollLength = this.wWidth; 
                }
            
                if(((this.position + 1) * scrollLength) <=  0){
                    this.atBoundary = false;
                    this.position += 1;
                    this.xPos      = this.position * scrollLength;
                } else {
                    defaults.leaveBoundsFunc();
                    this.xPos = 0;
                }
                
                $(this.element).stop().animate({
                    marginLeft: this.xPos
                }, defaults.duration, function(){
                    defaults.postAnimFunc();
                }); 
           
           },
           scrollUp: function(){      // Scroll the element up
                
                this.wHeight = $(window).height();                                                  // Height of Window
                
                var totalHeight = 0;
                $(this.element).find("li").each(function(){                                         // Total size of all elements combined 
                    totalHeight += $(this).outerHeight(true);
                });
                
                var elements      = $(this.element).find("li").length,                              // Get total # of elements inlistStylet
                    scrollLength  = parseInt(totalHeight / elements, 10);                           // Determine the length each scroll click should be
                
                if(defaults.scrollByPageSize){ 
                    scrollLength = this.wHeight; 
                }
                 
                if(((this.position + 1) *  scrollLength) <=  0){
                    this.atBoundary = false;                   
                    this.position += 1;
                    this.yPos     = this.position * scrollLength;
                } else {
                    defaults.leaveBoundsFunc();
                    this.yPos = 0;
                }
                
                $(this.element).stop().animate({
                    marginTop: this.yPos
                }, defaults.duration, function(){
                    defaults.postAnimFunc();
                });            
           },
           scrollDown: function(){      // Scroll the element down
                 
                this.wHeight = $(window).height();                                                  // Height of Window
                
                
                var totalHeight = 0;
                $(this.element).find("li").each(function(){                                         // Total size of all elements combined 
                    totalHeight += $(this).outerHeight(true);
                });
                
                var elements      = $(this.element).find("li").length,                              // Get total # of elements in list
                    scrollLength  = parseInt(totalHeight / elements, 10);                           // Determine the length each scroll click should be
                
                if(defaults.scrollByPageSize){ 
                    scrollLength = this.wHeight; 
                }
                
                if(((this.position - 1) *  scrollLength) >=  (-totalHeight  + this.wHeight)){
                    this.position -= 1;
                    this.yPos     = this.position * scrollLength;
                } else {
                    if(this.atBoundary){
                        defaults.leaveBoundsFunc();
                    }
                    this.yPos = (-totalHeight  + this.wHeight);
                    this.atBoundary = true;
                }
                
                $(this.element).stop().animate({
                    marginTop: this.yPos
                }, defaults.duration, function(){
                    defaults.postAnimFunc();
                });        
           }
        };      
        skrewler.init($(this));
        
        
        
        //---- Click and Keyboard Event handlers for calling the scroll function ----//
        
        // Left / Up Button Handler //
        $(defaults.leftUpButtonID).click(function() {  
            if(defaults.direction === 'horizontal'){
                 skrewler.scroll('left');
            
            } else {
                 skrewler.scroll('up');     
            }
            return false;
        });
                    
        // Right / Down Button Handler //
        $(defaults.rightDownButtonID).click(function() {
            if(defaults.direction === 'horizontal'){
                 skrewler.scroll('right');
            } else {
                 skrewler.scroll('down'); 
            }
            return false;
        });
        
        // Keyboard Press Event Handler //
        $(window).keydown(function(event) {
            if(defaults.enableKeys){
                if(defaults.direction === 'vertical'){
                    switch(event.which){
                        case defaults.keyCode_up:
                            skrewler.scroll("up");                          
                            event.preventDefault();
                            break;
                        case defaults.keyCode_down:
                            skrewler.scroll("down");                       
                            event.preventDefault();
                            break;
                    }   
                    event.preventDefault();
                }
                
                if(defaults.direction === 'horizontal'){
                    switch(event.which){
                        case defaults.keyCode_left:
                            skrewler.scroll('left'); 
                            event.preventDefault();
                            break;
                        case defaults.keyCode_right:
                            skrewler.scroll('right');                         
                            event.preventDefault();
                            break;
                    }                   
                
                }
            }
        });
        
        
        // ON window resize, adjust positioning of element
        $(window).resize(function(){

            if(defaults.direction === "vertical"){
                var elements  = $(skrewler.element).find("li").length,                               
                    totalHeight   = (elements * $(skrewler.element).find("li").outerHeight(true)),
                    scrollLength  = parseInt(totalHeight / elements, 10),
                    resizePos     = skrewler.position * scrollLength; 
                
                skrewler.yPos = resizePos;
                
                $(skrewler.element).stop().css({
                    marginTop: resizePos
                });
                
            } else {
                var elements  = $(skrewler.element).find("li").length,                              
                    totalWidth    = (elements * $(skrewler.element).find("li").outerWidth(true)),
                    scrollLength  = parseInt(totalWidth / elements, 10),
                    resizePos     = skrewler.position * scrollLength;
                
                skrewler.xPos = resizePos;
                
                $(skrewler.element).stop().css({
                    marginLeft: resizePos
                });
                    
            }
                
        });
        
        return this;          // Send object back for chaining
    };
})(jQuery);
