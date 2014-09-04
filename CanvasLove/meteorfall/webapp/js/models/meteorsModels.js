var CanvasElement = function(){
	this.id = Utils.getRandomId();
};

var CanvasData = function(canvas, onRedraw, frameRate){
	var self = this;
	self.canvas = canvas;
	
	if (self.canvas){
		self.context = self.canvas.getContext('2d');
		self.$canvas = $(canvas);
		
		self.meteors = [];
		self.stars = [];
		
		self.canvasInterval = null;
		self.frameRate = frameRate || 10;
		self.onRedraw = onRedraw || null;
		
		self.setRedraw = function(redraw){
			if (redraw && (typeof redraw === "function") ){
				self.onRedraw = redraw;
				self.canvasInterval = window.setInterval(self.onRedraw, frameRate);				
			}
		};
	}
	
};

var Meteor = function(size, location, speed, canvasShape){
	var self = this;
	self.size = size || null;
	self.location = location || {};
	self.speed = speed || {};
	self.age = 0;
	self.particles = [];
	self.particleCount = 0;
	
	self.setParticleCount = function(particleCount){
		self.particleCount = Number(particleCount);
		//generate the particles
		//Lets create some particles now
		for(var i = 0; i < self.particleCount; i++){
			self.particles.push(new MeteorParticle(self));
		}
	};
};


function MeteorParticle(meteorModel){
	var g_speedConstant = Math.random() * 5 + 5;
	this.meteorModel = meteorModel;
	this.speed = {
		x: -1 * (g_speedConstant/3) + Math.random()*g_speedConstant, 
		y: -1 * (g_speedConstant*3) + Math.random()*g_speedConstant*2
	};
	
	this.location = {
		x: meteorModel.location.x, 
		y: meteorModel.location.y
	};
	
	this.radius = Utils.getRandomInt(meteorModel.size);
	this.life = 20 + Math.random()*10;
	this.remaining_life = this.life;
	
	this.rgb = Utils.getRandomFlameRGB();
	
	this.r = this.rgb[0];
	this.g = this.rgb[1];
	this.b = this.rgb[2];
}

function CanvasShape(){
	
}

MeteorParticle.prototype = new CanvasElement();
CanvasShape.prototype = new CanvasElement();
Meteor.prototype = new CanvasElement();