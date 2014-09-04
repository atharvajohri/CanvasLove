Math.toDegrees = function (angle) {
  return angle * (180 / Math.PI);
};

var CanvasElement = function(){
	this.id = Utils.getRandomId();
};

var CanvasData = function(canvas, onRedraw, frameRate){
	var self = this;
	self.canvas = canvas;
	
	if (self.canvas){
		self.context = self.canvas.getContext('2d');
		self.$canvas = $(canvas);
		
		self.tadpoles = [];
		self.controller;
		
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

function Tadpole(jointCount, size){
	this.jointCount = jointCount || 10;
	this.jointSize = size || 10;
	
	this.headJoint;
	this.tailJoints = [];
	
	var self = this;
	self.moveTadpole = function(mouse){
		var headLocation = self.headJoint.location;
		self.headJoint.location = mouse.location;
		
		//bubble up the tail locations
		var c_jointLocation = headLocation;
		for (var i=0;i<self.tailJoints.length;i++){
			var tempJointLocation = self.tailJoints[i].location; 
			self.tailJoints[i].location = new Point(
				(c_jointLocation.x > tempJointLocation.x) ? (c_jointLocation.x - 2*self.jointSize*Math.cos(mouse.movementAngle*Math.PI/180)) : 
					(c_jointLocation.x + 2*self.jointSize*Math.cos(mouse.movementAngle*Math.PI/180)),
				(c_jointLocation.x > tempJointLocation.x) ? (c_jointLocation.y - 2*self.jointSize*Math.sin(mouse.movementAngle*Math.PI/180)) :
					(c_jointLocation.y + 2*self.jointSize*Math.sin(mouse.movementAngle*Math.PI/180))
			);
			c_jointLocation = tempJointLocation;
		}
	};
}

function TadpoleJoint(){
	this.location = new Point();
}

function MouseStatus(location){
	
	var self = this;
	
	this.oldLocation = null;
	this.location = location || new Point();
	
	this.dragging = false;
	this.movementAngle = false;
	
	this.updateLocation = function(location){
		self.location = location;
		if (self.oldLocation && self.location){
//			self.movementAngle = Math.atan2((self.location.y - self.oldLocation.y)/(self.location.x - self.oldLocation.x));
			self.movementAngle = Math.floor(Math.toDegrees(Math.atan((self.location.y - self.oldLocation.y)/(self.location.x - self.oldLocation.x))));
//			console.log (self.location.y + ", " + self.oldLocation.y + ", " + self.location.x + ", " + self.oldLocation.x + " ---- " + self.movementAngle);
		}else{
			self.movementAngle = 0;
		}
		
		self.oldLocation = self.location;
	};
}

function Point(x, y, z){
	this.x = x;
	this.y = y;
	this.z = z;
}