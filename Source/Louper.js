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
		var src = this.options.big || this.small.get('big');
		if(Browser.Engine.trident){
			if(!document.namespaces.v){
				document.namespaces.add("v", "urn:schemas-microsoft-com:vml");
				document.createStyleSheet().cssText = "v\\:fill, v\\:oval{behavior:url(#default#VML);display:inline-block}";
			}
			var canvas = new Element('v:oval');
			canvas.strokeweight = '0px';
			canvas.style.width = radius*2;
			canvas.style.height = radius*2;
			var fill = new Element('v:fill').inject(canvas);
			fill.type = 'tile';
			fill.src = src;
			this.canvas = canvas;
			this.fill = fill;
		}else{
			this.canvas = new Element('canvas', {width: radius*2, height: radius*2});
			this.context = this.canvas.getContext("2d");
		}
		this.canvas.setStyles({
			position: 'absolute',
			left: 0,
			top: 0,
			opacity: 1
		});
		this.small = document.id(element);
		if(!this.small.complete){
			this.small.addEvent('load', function(){
				this.prepareSmall();
			}.bind(this));
		}else{
			this.prepareSmall();
		}
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
		this.wrapper = new Element('div', {'class': 'louper-wrapper'}).wraps(this.small).setStyles({
			width: this.small.offsetWidth,
			height: this.small.offsetHeight,
			position: 'relative',
			overflow: 'visible'
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
		if(!Browser.Engine.trident){
			globalCompositeOperation = "source-in";
			this.context.fillStyle = 'rgba(255,255,255,0)';
			this.context.strokeStyle = 'rgb(255,255,255)';		
		}
		this.wrapper.addEvents({
			mouseenter: this.startZoom.bind(this),
			mouseleave: this.stopZoom.bind(this),
			mousemove: this.move.bind(this)
		});
		
	},
	
	move: function(event){
		if(!this.position) return;
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
		var loupeSize = this.options.radius * 2;
		var x = dst.left + loupeSize;
		var y = dst.top + loupeSize;
		if(!Browser.Engine.trident){
			var context = this.context;
			context.clearRect(0, 0, this.canvas.width, this.canvas.height);
			context.beginPath();
			context.arc(radius, radius, radius, 0, Math.PI*2, true); 
			context.closePath();
			context.clip();
			context.drawImage(this.big, -x, -y);
			context.fill();
		}else{
			this.fill.position = -x/loupeSize + "," + -y/loupeSize;
		}
	}
	
});
