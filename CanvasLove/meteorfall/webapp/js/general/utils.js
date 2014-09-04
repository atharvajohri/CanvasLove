//generate a random numeric number for id
var Utils = {};

Utils.getRandomId = function(customScale){
	return Math.floor(Math.random()* (customScale || 99999));
};

Utils.getMousePositionInCanvas = function(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
    	x: (evt.clientX - rect.left),
      	y: (evt.clientY - rect.top)
    };
};

Utils.getRandomInt = function(scale){
	return Math.floor( Math.random() * (scale || 100) );
};

Utils.getRandomFlameRGB = function(flameRGBs){
	flameRGBs = flameRGBs || [
	     [255, 255, 204],
	     [255, 255, 153],
	     [255, 255, 102],
	     [255, 255, 51],
	     [255, 255, 0],
	     [204, 204, 0],
	     [153, 153, 0],
	     [102, 102, 0],
	     [51 , 51,  0],
	     [255, 255, 224],
	     [255, 250, 205],
	     [250, 250, 210]
	];
	return flameRGBs[Math.floor(Math.random()*flameRGBs.length)];
};