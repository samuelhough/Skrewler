/* 

@name: Skrewler
@plugin: jQuery
@description: A jQuery plugin for scrolling list elements horizontally and vertically
@author: Sam Hough
@version: Alpha 1.1
@updated: November 10th, 2011
@contributors:
Chris Abrams

@license:
Copyright (c) 2011 Samuel Hough

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
     
*/

(function($) {
    $.fn.skrewler = function(options){
       
       // Error Reporting Object
       var error = {
           e: "Skrewler ERROR: ",
           noDirection: function(){
               console.error(this.e + "No direction was provided to the handler - $('#yourElement').skrewler({ direction: 'vertical' (or) 'horizontal' ");
           
           },
           leftUp: function(){
               console.error(this.e + "No id for leftUpButtonID && enableKeys === false   FIX:  $('#yourElement').skrewler({ leftUpButtonID: '#id'");
           
           },
           rightDown: function(){
               console.error(this.e + "No id for rightDownButtonID && enableKeys === false  FIX:  $('#yourElement').skrewler({ rightDownButton: '#id'");           
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
            include: {
                margin: false,
                padding: false,
                border: false
            },
            
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
           xORy: {
               xPos: 0,                               // marginLeft size in horizontal scrolling   
               yPos: 0,                               // marginTop  size in vertical scroling
               setPos: function(direction, newPos){
                    if(direction === 'left' || direction == 'right'){
                         xPos = newPos;
                    } else {
                         yPos = newPos;
                    }
               },
               retPos: function(direction){
                    if(direction === 'left' || direction == 'right'){
                         return xPos;
                    } else {
                         return yPos;
                    }
               }
           },
           atBoundary: false,                     // If (atBoundary) and the user tries to go past it, the defaults.leaveBoundsFunc() is called
           init: function(obj){
                this.wHeight = $(window).height();
                this.wWidth  = $(window).width();
                this.element = obj;
                
                // Check if object has all three includes are there
                if(!defaults.include.hasOwnProperty('margin')){
                    defaults.include.margin = false;
                }
                if(!defaults.include.hasOwnProperty('border')){
                    defaults.include.border = false;
                }
                if(!defaults.include.hasOwnProperty('padding')){
                    defaults.include.padding = false;
                }
                
                
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
               this.wWidth  =  $(this.element).parent().width();       // Width of Window
               this.wHeight =  $(this.element).parent().height();      // Height of Window
                console.log(this.wWidth);
               
               
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
               this.scrollDir(direction);
           },
           remPX: function(string){
                string = ''+string+'';
                if(string.charAt(string.length)== 'x'){
                    return parseInt(string.substring(0,string.length-2),10);
                } else {
                    return parseInt(string,10);
                }
           },
           scrollDir: function(direction){
                console.log(direction);
                var borderOne = '',
                    borderTwo = '',
                    marginPadOne = '',
                    marginPadTwo = '',
                    totalSize = 0,
                    wSize = 0,
                    obj = {};
                    
                if(direction == 'left' || direction == 'right'){
                     borderOne = 'Left';
                     borderTwo = 'Right';
                     marginPadOne = 'left';
                     marginPadTwo = 'right';
                     wSize = this.wWidth;
                } else {
                     borderOne = 'Top';
                     borderTwo = 'Bottom';
                     marginPadOne = 'top';
                     marginPadTwo = 'bottom';
                     wSize = this.wHeight;
                }
                
                $(this.element).find("li").each(function(){                                         // Total size of all elements combined 
                    var tmp = 0;
                    if(defaults.include.border){

                        tmp += skrewler.remPX($(this).css('border'+borderOne+'Width'));
                        tmp += skrewler.remPX($(this).css('border'+borderTwo+'Width'));
                    }
                    if(defaults.include.margin){
                        tmp += skrewler.remPX($(this).css('margin-'+marginPadOne));
                        tmp += skrewler.remPX($(this).css('margin-'+marginPadTwo));
                    }
                    if(defaults.include.padding){
                        tmp += skrewler.remPX($(this).css('padding-'+marginPadOne));
                        tmp += skrewler.remPX($(this).css('padding-'+marginPadTwo));
                    }
                    console.log(tmp);
                    totalSize += tmp;
                    
                    if(direction == 'left' || 'right'){
                         totalSize += skrewler.remPX($(this).width());
                    } else {
                         totalSize += skrewler.remPX($(this).height());
                    }
                    
                });
                console.log('out of each');
                
                var elements      = $(this.element).find("li").length,                              // Get total # of elements in list                      
                    scrollLength  = parseInt(totalSize / elements, 10);                            // Determine the length each scroll click should be
                
                if(defaults.scrollByPageSize){ 
                    if(direction == 'left' || 'right'){
                         scrollLength = this.wWidth;
                    } else {
                         scrollLength = this.wHeight;
                    }
                 }
                
                if(direction == 'left' || direction == 'down'){
                    console.log('left or up' + direction);
                    if(((this.position - 1) * scrollLength) >=  (-totalSize  + wSize)){
                        this.position -= 1;
                        this.xORy.setPos(direction, (this.position * scrollLength));
                    } else {
                        if(this.atBoundary){ 
                            defaults.leaveBoundsFunc();
                        }
                        this.xORy.setPos(direction, (-totalSize  + wSize));
                        this.atBoundary = true;
                    }
                } else {       
                    console.log('right or up');                 
                    if(((this.position + 1) * scrollLength) <=  0){
                        this.atBoundary = false;
                        this.position += 1;
                        this.xORy.setPos(direction, (this.position * scrollLength));
                    } else {
                        defaults.leaveBoundsFunc();
                        this.xORy.setPos(direction, (0));
                    }
                }
               // console.log('scrollLength: ' + scrollLength + 'totalWidth: '+totalSize + ' atBoundary: ' + this.atBoundary + ' position: '+this.position+ ' xPos ' +  skrewler.xORy.retPos(direction) + " wWidth " + wSize);
                
                if(direction == 'left' || direction == 'right'){
                    obj = {
                        marginLeft: skrewler.xORy.retPos(direction)
                    };
                } else {
                    obj = {
                        marginTop: skrewler.xORy.retPos(direction)
                    };
                }
                
                $(this.element).stop().animate(obj, defaults.duration, function(){
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
