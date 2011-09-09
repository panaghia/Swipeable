/*
this is swipeable JS

author Sergio Panagia (http://panaghia.it)
MIT STYLE LICENSE
*/

(function()
{
Swipeable = function(scrollerId, options)
{
	this.scroller = document.getElementById(scrollerId);	
	this.singleWidth = 0;
	this.totalWidth = 0;   	
	this.slotsNumber = 0;  
	this.options = options; 
	this.currentPage = 0;
	
	this.lock = false;
		
	this.calculateContainerWidth();
	this.attachEvents();
	
} 

Swipeable.prototype.calculateContainerWidth = function()
{
	var children = this.scroller.querySelectorAll('._snap');  
	this.singleWidth = getComputedStyle(children[0], "").getPropertyValue("width").match(/(\d*\.?\d*)(.*)/)[1];
	this.totalWidth = this.singleWidth * children.length;  
	this.slotsNumber = children.length;
	this.scroller.style.width = this.totalWidth+"px";
}

Swipeable.prototype.snap2Page = function(pageNumber)
{
	var newOff = -(pageNumber * this.singleWidth);
	this.scroller.style.webkitTransform = 'translate3d('+newOff+'px, 0, 0)';
	this.currentPage = pageNumber;
	this.options.onSwipeEnd.call(this);
}


Swipeable.prototype.attachEvents = function()
{
	var that = this;
	var absX = 0;
	var xPos = 0;
	var yPos = 0;
	var deltaX = 0;
	var deltaY = 0;	
	var endX = 0;
	var startX = 0;// this.currentPage * this.singleWidth;
	var dir = 0; 
	
	var off = 0;
   
  
	
	
	var scroller = this.scroller;

	scroller.addEventListener('touchstart', touchStart, false);
	
	function touchStart(e)
	{
		e.stopPropagation();		
		yPos = e.touches[0].pageY;
		deltaX = e.touches[0].pageY;
		xPos = startX;
		deltaX = e.touches[0].pageX - startX; 
		//console.log(e.touches[0].pageX+" "+startX);
		scroller.addEventListener('touchmove', touchMove, false);
		scroller.addEventListener('touchend', touchEnd, false); 
		 
		//recalculate absx and off because of snap2page evenience
		absX = off = -(that.singleWidth*(that.currentPage)); 
		that.lock = false;   		
	}   
	function touchMove(e)
	{
		deltaY = e.touches[0].pageY - yPos;    	
		var delta = e.touches[0].pageX - deltaX;

		
		if(Math.abs(delta) < 25)
			that.lock = true;
		else
		    that.lock = false;
			
		delta = parseInt(delta/1.5);
		startX = endX = delta;     
		
		if(!that.lock)
		{ 		
			scroller.style.webkitTransition = '';
			scroller.style.webkitTransform = 'translate3d('+(parseInt(absX)+delta)+'px, 0, 0)';  					
		}
		else
			delta = 0;
		scroller.removeEventListener('touchmove', this); 
		scroller.removeEventListener('touchend', this);   
	}
	function touchEnd(e)
	{                   
	   	
		function restoreState()
		{
		    scroller.style.webkitTransition = 'all 300ms ease-in-out';
			scroller.style.webkitTransform = 'translate3d('+off+'px, 0, 0)';
			startX = 0;      
		}
		
		var finalDelta = xPos - endX; 
		//console.log('current offset: '+off);
		if(finalDelta < 0 && !that.lock)
		{
			if(finalDelta < -50 && off < 0)
			{
				scroller.style.webkitTransition = 'all 200ms ease-in-out';
				off+=parseInt(that.singleWidth);
				//console.log('new offset < 0: '+off);
				scroller.style.webkitTransform = 'translate3d('+off+'px, 0, 0)';   			
				absX = off;
				startX = 0;                        
				
				that.currentPage--;
				that.options.onSwipeEnd.call(that);    			 			
			}
			else
				restoreState();
		}
		else if(finalDelta > 0 && !that.lock)
		{                                 
			var deadline = (that.slotsNumber-2) * that.singleWidth;
			if(finalDelta > 50 && off >= -deadline)
			{
				scroller.style.webkitTransition = 'all 200ms ease-in-out';
				off-=parseInt(that.singleWidth);
				//console.log('new offset >=0: '+off);
				scroller.style.webkitTransform = 'translate3d('+off+'px, 0, 0)';     			
				absX = off; 
				startX = 0;     
				
				that.currentPage++;
				that.options.onSwipeEnd.call(that);  	
			}
			else
				restoreState();
		}      
		that.lock = false;	
	}	
}   

})();