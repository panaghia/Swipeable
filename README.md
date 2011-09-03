Swipeable let you create scrollable area for touch-based device with horizontal snap, keeping vertical scrolling free.

How to use
----------
Create an html structure like this:

	<div id="scroller">
		<div class="snap">
			<p>Page 1</p>
		</div>
		<div class="snap">
			<p>Page 2</p>
		</div>
		<div class="snap">
			<p>Page 3</p>
		</div>	
	</div> 
Then declare an instance of Swipeable:

	var sw = new Swipeable('scroller');

you can grab on-swipe-end event with the following syntax: 

	var sw = new Swipeable('scroller', {
		onSwipeEnd: function()
		{
			console.log(this.currentPage);
		}
	})     
	
Copyright
---------
MIT STYLE LICENSE.
http://www.panaghia.it/copyright.html
Author Sergio Panagia