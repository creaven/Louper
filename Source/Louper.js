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
	
	Implements: [Options, Events],
	
	options: {
		radius: 40,
		start: 'bottom right'
	},
	
	initialize: function(element, options){
		this.setOptions(options);
		var radius = this.options.radius;
		this.small = document.id(element);
		var src = this.options.big || this.small.get('big');
		if(Browser.Engine.trident){
			if(!document.namespaces.v){
				document.namespaces.add("v", "urn:schemas-microsoft-com:vml");
				document.createStyleSheet().cssText = "v\\:fill, v\\:oval{behavior:url(#default#VML);display:inline-block}";
			}
			var canvas = new Element('v:oval');
			canvas.stroked = false;
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
			cursor: 'move'
		});
		this.big = new Element('img', {src: src}).setStyles({
			position: 'absolute',
			top: 0,
			left: 0
		});
		this.loupe = new Element('img', {src: this.options.loupe.src}).setStyles({
			cursor: 'move'
		});
		this.load([this.small, this.onSmallLoad], [this.big, this.onBigLoad], [this.loupe, this.onLoupeLoad]);
		
	},
	
	load: function(){
		var l = arguments.length;
		var count = l;
		for(var i = 0; i < l; i++){
			var img = arguments[i][0];
			var fun = arguments[i][1];
			img.addEvent('load', function(){
				if(arguments.callee.loaded) return;
				arguments.callee.loaded = true;
				var fun = arguments[0];
				fun.call(this);
				--count;
				if(!count) this.ready();
			}.bind(this, fun));
			if(img.complete) img.fireEvent('load');
		}
	},
	
	onSmallLoad: function(){
		this.wrapper = new Element('div').wraps(this.small).setStyles({
			width: this.small.offsetWidth,
			height: this.small.offsetHeight,
			position: 'relative',
			overflow: 'visible'
		}).addEvent('mousedown', function(event){
			event.preventDefault();
		});
		['margin', 'left', 'top', 'bottom', 'right', 'float', 'clear', 'border'].each(function(p){
			var style = this.small.getStyle(p);
			var dflt = 'auto';
			if(['float', 'clear', 'border'].contains(p)) dflt = 'none';
			try{
				this.small.setStyle(p, dflt);
				this.wrapper.setStyle(p, style);
			}catch(e){};
		}, this);
		this.smallSize = {
			width: this.small.width,
			height: this.small.height
		};
	},
	
	onBigLoad: function(){
		this.bigSize = {
			width: this.big.width,
			height: this.big.height
		};
	},
	
	onLoupeLoad: function(){
		var k = this.options.radius / this.options.loupe.radius;
		var width = this.loupe.width * k;
		var height = this.loupe.height * k;
		this.loupeSize = {
			width: width,
			height: height
		};
		this.loupe.setStyles({
			width: width,
			height: height,
			position: 'absolute',
			zIndex: 1
		}).inject(this.wrapper);
		this.loupeWrapper = new Element('div').setStyles({
			position: 'absolute',
			top: 0,
			left: 0
		}).adopt(this.loupe).setStyles(this.options.start);
		this.canvas.setStyles({
			position: 'absolute',
			left: this.options.loupe.x * k - this.options.radius,
			top: this.options.loupe.y * k - this.options.radius
		});
		if(Browser.Engine.trident){
			var src = this.loupe.src;
			this.loupe = new Element('div').replaces(this.loupe).setStyles({
				width: width,
				height: height,
				position: 'relative'
			});
			this.loupe.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + src + "',sizingMethod='scale')";
			this.loupe.style.background = 'none';
		}
	},
	
	ready: function(){
		this.loupeWrapper.inject(this.wrapper);
		this.canvas.inject(this.loupeWrapper);
		this.loupeWrapper.setStyle('opacity', 0)
		this.wrapper.addEvents({
			mouseenter: this.showLoupe.bind(this),
			mouseleave: this.hideLoupe.bind(this)
		});
		var delta = {
			x: this.canvas.getStyle('left').toInt(),
			y: this.canvas.getStyle('top').toInt()
		}
		var extra = this.options.radius*(1 - this.smallSize.width/this.bigSize.width/Math.sqrt(2));
		this.loupeWrapper.makeDraggable({
			limit: {
				x: [Math.round(0 - delta.x - extra), Math.round(this.smallSize.width - delta.x + extra - 2*this.options.radius)],
				y: [Math.round(0 - delta.y - extra), Math.round(this.smallSize.height - delta.y + extra - 2*this.options.radius)]
			},
			preventDefault: true,
			onDrag: this.zoom.bind(this)
		});
		this.fireEvent('ready');
	},
	
	showLoupe: function(){
		this.position = this.small.getPosition();
		this.zoom();
		this.loupeWrapper.fade('in');
	},
	
	hideLoupe: function(){
		this.loupeWrapper.fade('out');
	},
	
	zoom: function(){
		var radius = this.options.radius;
		var loupeSize = this.options.radius * 2;
		var pos = this.canvas.getPosition();
		var x = (pos.x - this.position.x  + loupeSize/2) * this.bigSize.width / this.smallSize.width - loupeSize/2;
		var y = (pos.y - this.position.y + loupeSize/2) * this.bigSize.height / this.smallSize.height - loupeSize/2;
		if(!Browser.Engine.trident){
			var context = this.context;
			try{
				context.save();
				context.beginPath();
				context.arc(radius, radius, radius, 0, Math.PI*2, true); 
				context.closePath();
				context.clip();
				context.fillStyle = 'rgb(255,255,255)';
				context.fillRect(0, 0, this.canvas.width, this.canvas.height);
				context.clearRect(0, 0, this.canvas.width, this.canvas.height);
				context.drawImage(this.big, -x, -y);
				context.restore();
			}catch(e){};
		}else{
			this.fill.dispose();
			this.fill.position = -x/loupeSize + "," + -y/loupeSize;
			this.fill.inject(this.canvas);
		};
		var extra = this.options.radius *(1 - this.smallSize.width/this.bigSize.width)/Math.sqrt(2);
		var limit = {
			left: this.position.x - extra,
			right: this.position.x + this.smallSize.width + extra,
			top: this.position.y - extra,
			bottom: this.position.y + this.smallSize.height + extra
		};
		var coords = this.canvas.getCoordinates();
		var clip = {};
		['left', 'right', 'top', 'bottom'].each(function(side){
			if(side == 'left' || side == 'top'){
				coords[side] = -coords[side];
				limit[side] = -limit[side]
			};
			if(coords[side] > limit[side]){
				clip[side] = Math.ceil(coords[side] - limit[side]);
			}else{
				clip[side] = 'auto';
			};
		});
		this.canvas.setStyle('clip', 'rect(' + 
			(clip.top != 'auto' ? clip.top + 'px' : 'auto') + ' ' + 
			(clip.right != 'auto' ? (loupeSize - clip.right) + 'px' : 'auto') + ' ' + 
			(clip.bottom != 'auto' ? (loupeSize - clip.bottom) + 'px' : 'auto') + ' ' + 
			(clip.left != 'auto' ? clip.left + 'px' : 'auto') + 
		')');
	}
	
});