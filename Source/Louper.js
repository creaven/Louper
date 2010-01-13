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
		radius: 40
	},
	
	initialize: function(element, options){
		this.setOptions(options);
		var radius = this.options.radius;
		this.canvas = new Element('canvas', {width: radius*2, height: radius*2}).setStyles({
			position: 'absolute',
			left: 0,
			top: 0,
			opacity: 1
		});
		this.context = this.canvas.getContext("2d");
		this.small = document.id(element);
		if(!this.small.complete){
			this.small.addEvent('load', function(){
				this.prepareSmall();
			}.bind(this));
		}else{
			this.prepareSmall();
		}
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
	
	prepareSmall: function(){
		this.wrapper = new Element('div', {'class': 'looper-wrapper'}).wraps(this.small).setStyles({
			width: this.small.offsetWidth,
			height: this.small.offsetHeight,
			position: 'relative',
			overflow: 'hidden'
		});
		this.smallSize = {
			width: this.small.width,
			height: this.small.height
		};
		if(this.bigPrepared){
			this.ready();
		}else{
			this.smallPrepared = true;
		}
	},
	
	prepareBig: function(){
		this.bigSize = {
			width: this.big.width,
			height: this.big.height
		};
		if(this.smallPrepared){
			this.ready();
		}else{
			this.bigPrepared = true;
		}
	},
	
	ready: function(){
		this.canvas.inject(this.wrapper);
		var context = this.context;
		globalCompositeOperation = "source-in";
		context.fillStyle = 'rgba(255,255,255,0)';
		context.strokeStyle = 'rgb(255,255,255)';
		context.beginPath();
		var radius = this.options.radius;
		context.arc(radius, radius, radius, 0, Math.PI*2, true); 
		context.closePath();
		context.clip();
		context.drawImage(this.big, 0, 0);
		context.fill();
		
		
		this.wrapper.addEvents({
			mouseenter: this.startZoom.bind(this),
			mouseleave: this.stopZoom.bind(this),
			mousemove: this.move.bind(this)
		});
		
	},
	
	move: function(event){
		this.dstPos = event.page;
		this.zoom()
	},
	
	startZoom: function(){
		this.position = this.wrapper.getPosition();
		//this.timer = this.zoom.periodical(10, this);
		//this.big.fade('in');
	},
	
	stopZoom: function(){
		//$clear(this.timer);
		//this.big.fade('out');
	},
	
	zoom: function(){
		var context = this.context;
		var radius = this.options.radius;
		
		
		var current = {
			left: this.canvas.getStyle('left').toInt(),
			top: this.canvas.getStyle('top').toInt()
		};
		var dst = {
			left:  parseInt((this.dstPos.x - this.position.x) * (this.bigSize.width/this.smallSize.width)),
			top:  parseInt((this.dstPos.y - this.position.y) * (this.bigSize.height/this.smallSize.height))
		};
		this.canvas.setStyles({
			left: this.dstPos.x - this.position.x,
			top: this.dstPos.y - this.position.y
		});
		context.beginPath();
		
		context.arc(radius, radius, radius, 0, Math.PI*2, true); 
		context.closePath();
		context.clip();
		var x = dst.left + this.options.radius * 2;
		var y = dst.top + this.options.radius * 2;
		context.drawImage(this.big, 
			x, y, this.bigSize.width, this.bigSize.height,
			0, 0, this.bigSize.width, this.bigSize.height
		);
		context.fill();
	}
	
});
