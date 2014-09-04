var GlobalElements = {
	$canvas: $("#page-canvas"),
	windowWidth: $(window).width(),
	windowHeight: $(window).height(),
	mouse: new MouseStatus()
};

var GE = GlobalElements;
var CD = new CanvasData(GE.$canvas[0]);

$(window).on("load resize", function(){
	setupCanvas();
});

function setupCanvas(){
	GE.$canvas.attr("height", $(window).height());
	GE.$canvas.attr("width", $(window).width());
	initializeCanvasData();
}

function initializeCanvasData(){
	addTadpole(true);
	
	GE.$canvas[0].removeEventListener('mousemove', trackMouse);
	GE.$canvas[0].addEventListener('mousemove', trackMouse, true);
	
	CD.setRedraw(renderCanvas);
}

function drawCanvas(){
	CD.context.clearRect(0, 0, GE.windowWidth, GE.windowHeight);
}

function trackMouse(e){
	GE.mouse.updateLocation(Utils.getMousePositionInCanvas(GE.$canvas[0], e));
	if (CD.controller){
		CD.controller.moveTadpole(GE.mouse);
	}
}

function addTadpole(controller){
	var tadpole = new Tadpole();
	for (var i =0;i<tadpole.jointCount;i++){
		var c_joint = new TadpoleJoint();
		c_joint.location = {
			x: tadpole.headJoint ? (tadpole.headJoint.location.x - i * 2 * tadpole.jointSize) : GE.windowWidth/2,
			y: GE.windowHeight/2,
			z: null
		};
		
		if (i===0){
			tadpole.headJoint = c_joint;
		}else{
			tadpole.tailJoints.push(c_joint);
		}
	}
	
	if (controller){
		CD.controller = tadpole;
	}
	
	CD.tadpoles.push(tadpole);
}

function renderCanvas(){
	CD.context.clearRect(0, 0, GE.windowWidth, GE.windowHeight);	
	drawTadpoles();
}

function drawTadpoles(){
	for (var i=0;i<CD.tadpoles.length;i++){
		var c_tadpole = CD.tadpoles[i];
		drawTadpoleJoint(c_tadpole.headJoint, c_tadpole.jointSize);
		for (var k=0;k<c_tadpole.tailJoints.length;k++){
			drawTadpoleJoint(c_tadpole.tailJoints[k], c_tadpole.jointSize);
		}
	}
}

function drawTadpoleJoint(tadpoleJoint, size){
	CD.context.beginPath();
	CD.context.arc(tadpoleJoint.location.x, tadpoleJoint.location.y, size, 0, 2 * Math.PI, false);
	CD.context.fillStyle = 'green';
	CD.context.fill();	
}

	