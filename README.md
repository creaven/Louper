Louper
======
Louper is simple and nice image zoom class which use real loupe (not rectangle)

![Screenshot](http://mifjs.net/assets/images/louper.jpg)

How to use
----------

[demo](http://mifjs.net/misc/louper/Demo/)



Example1:

html:

	<img src="gomer-small.jpg" id="homer" big="gomer.jpg"/>
	
js:

	var loupe = {
		src: 'loupe2.png',//image from http://www.netzgesta.de/loupe/
		x: 111,
		y: 109,
		radius: 103
	}
	new Louper('homer', {
		radius: 30,
		loupe: loupe
	});

Example2:

html:

	<img src="girl-thumb.jpg" id="girl"/>

js:

	new Louper('girl', {
		big: 'girl.jpg',
		radius: 80,
		loupe: {
			src: 'loupe.png', //image from http://img.artlebedev.ru/studio/us/2009/loup.png
			x: 101,
			y: 102,
			radius: 85
		},
		onReady: function(){
			this.loupeWrapper.setStyles({
				left: this.smallSize.width - this.loupeSize.width + 60,
				top: this.smallSize.height - this.loupeSize.height + 120
			});
		}
	});
	
Example3:
	
html:

	<img src="small.jpg" id="brain" big="big.jpg"/>
	
js:

	var loupe2 = {
		src: 'loupe2.png',//image from http://www.netzgesta.de/loupe/
		x: 111,
		y: 109,
		radius: 103
	}
	new Louper('brain', {
		loupe: loupe2,
		radius: 100
	});