/*
---
 
name: Louper
description: Class to zoom image using real loupe
license: MIT-Style License (http://mifjs.net/license.txt)
copyright: Anton Samoylov (http://mifjs.net)
authors: Anton Samoylov (http://mifjs.net)
requires: core:1.2.4:*
provides: Louper
 
...
*/

var Louper = new Class({
	
	version: 'dev',
	
	Implements: [Options],
	
	options: {
		
	},
	
	initialize: function(element, options){
		this.setOptions(options);
		this.canvas = new Element('canvas');
		this.context = this.canvas.getContext("2d");
		var src = this.options.big || this.small.get('big');
		this.big = new Element('img', {src: src}).setStyles({
			position: 'absolute',
			top: 0,
			left: 0,
			opacity: 0,
			cursor: 'crosshair'
		});
		if(!this.big.complete){
			this.big.addEvent('load', function(){
				this.prepareBig();
			}.bind(this));
		}else{
			this.prepareBig();
		}
		
	},
	
	prepareBig: function(){
		this.canvas.inject(document.body).setStyles({
			position: 'absolute',
			left: 250,
			top: 50
		}).makeDraggable();
		
		
		var context = this.context;
		globalCompositeOperation = "source-in";
		context.fillStyle = 'rgba(255,255,255,0)';
		context.strokeStyle = 'rgb(255,255,255)';
		context.beginPath();
		context.arc(100, 100, 50, 0, Math.PI*2, true); 
		context.closePath();
		context.clip();
		context.fillRect(0 , 0, 250, 50);
		context.drawImage(this.big, 0, 0);
		context.fill();
	}
	
});
