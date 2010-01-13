/*
---
 
name: Looper
description: Class to zoom image using real loop
license: MIT-Style License (http://mifjs.net/license.txt)
copyright: Anton Samoylov (http://mifjs.net)
authors: Anton Samoylov (http://mifjs.net)
requires: core:1.2.4:*
provides: Looper
 
...
*/

var Looper = new Class({
	
	version: 'dev',
	
	Implements: [Options],
	
	options: {
		
	},
	
	initialize: function(element, options){
		this.setOptions(options);
		...
	}
	
});
