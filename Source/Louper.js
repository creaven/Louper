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
		this.context.drawImage(this.big, 0, 0);
		this.canvas.inject(document.body);
	}
	
});
