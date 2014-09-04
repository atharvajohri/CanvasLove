var GlobalElements = {
	$canvas: $("#page-canvas"),
	windowWidth: $(window).width(),
	windowHeight: $(window).height(),
	meteorCount: 30,
	starCount: 200,
	planetCount: 15
};

var GE = GlobalElements;
var CD = new CanvasData(GE.$canvas[0]);

$(window).on("load resize", function(){
	setupCanvas();
});

function setupCanvas(){
	GE.$canvas.attr("height", $(window).height());
	GE.$canvas.attr("width", $(window).width());
	CD.meteors = [];
	CD.stars = [];
	initializeCanvasData();
}

function initializeCanvasData(){
	
	CD.stars = generateStars();
	
	//create a meteor
	var k=0;
	while (k<GE.meteorCount) {
		setTimeout(function(){
			CD.meteors.push(addMeteor());			
		}, 500 + Math.random()*5000);
		k++;
	}
	
	CD.context.globalCompositeOperation = "source-over";
	CD.context.fillStyle = "black";
	CD.context.fillRect(0, 0, GE.windowWidth, GE.windowHeight);
	CD.context.globalCompositeOperation = "lighter";
	drawStars();
	//drawPlanets(1, function(){
		var canvasBackground = GE.$canvas[0].toDataURL();
		
		var canvasBackgroundImage = new Image();
		canvasBackgroundImage.onload = function() {
			CD.canvasBackground = canvasBackgroundImage;
			CD.setRedraw(drawCanvas);
		};
		canvasBackgroundImage.src = canvasBackground;
	//});
}

function drawStars(){
	CD.context.rect(0, 0, GE.windowWidth, GE.windowHeight);
	for (var s =0;s<CD.stars.length;s++){
		var starData = CD.stars[s];
		CD.context.fillStyle = starData.gradient;
		CD.context.fill();		
	}
}

function drawPlanets(p, completeCallback){
	p = p || 1;
	if (p < GE.planetCount+1){
//		CD.context.arc(Utils.getRandomInt(GE.windowWidth), Utils.getRandomInt(GE.windowHeight), Utils.getRandomInt(8), 0, Math.PI*2, true);
//		CD.context.clip();
		var planetImg = new Image();
		planetImg.addEventListener('load', function(e) {
			/*CD.context.fillStyle = CD.context.createPattern(this, 'no-repeat'); 
			CD.context.fill();
			drawPlanets(++p);*/
			
			var planetRadius = Utils.getRandomInt(40)+20;
			var planetX = Utils.getRandomInt(GE.windowWidth);
			var planetY = Utils.getRandomInt(GE.windowHeight);
			
			CD.context.save();
			CD.context.beginPath();
			CD.context.arc(planetX, planetY, planetRadius, 0, Math.PI * 2, true);
			CD.context.closePath();
			CD.context.clip();

			CD.context.drawImage(this, planetX-planetRadius, planetY-planetRadius, planetRadius*2, planetRadius*2);

			CD.context.beginPath();
			CD.context.arc(planetX-planetRadius, planetY-planetRadius, planetRadius, 0, Math.PI * 2, true);
			CD.context.clip();
			CD.context.closePath();
			CD.context.restore();
			
			drawPlanets(++p, completeCallback);
		}, true);
		var fileNumber = p%11 || 1;
		planetImg.src = "images/textures/planet"+fileNumber+".jpg";		
	}else{
		if (completeCallback){
			completeCallback();
		}
	}
}

function generateStars(){
	var starsArray = [];
	var s = 0;
	while (s < GE.starCount){
		var starData = {
			x: Utils.getRandomInt(GE.windowWidth),
			y: Utils.getRandomInt(GE.windowHeight),
			size: Utils.getRandomInt(5)
		};
		var grd = CD.context.createRadialGradient(starData.x, starData.y, starData.size, starData.x, starData.y, (starData.size + Utils.getRandomInt(10)) );
		grd.addColorStop(0, '#FFFFFF');
	    grd.addColorStop(1, '#000000');
	    starData.gradient = grd;
		starsArray.push(starData);
		s++;
	}
	
	return starsArray;
} 

function addMeteor(){
	var c_meteor = new Meteor();
	c_meteor.size = Utils.getRandomInt(20) + 5;
	c_meteor.location.x = Utils.getRandomInt(GE.windowWidth*1.5); 
	c_meteor.location.y = 0;
	c_meteor.location.z = Utils.getRandomInt(10);
	c_meteor.speed = {
		x: -c_meteor.size/1000,// + Math.random()*0.010, 
		y: c_meteor.size/1000// + Math.random()*0.010
	};
	c_meteor.setParticleCount(100);
	
	return c_meteor;
}

function drawCanvas(){
	CD.context.globalCompositeOperation = "source-over";
	if (CD.canvasBackground){
		CD.context.drawImage(CD.canvasBackground, 0, 0, GE.windowWidth, GE.windowHeight);
	}else{
		CD.context.fillStyle = "black";
		CD.context.fillRect(0, 0, GE.windowWidth, GE.windowHeight);		
	}
	CD.context.globalCompositeOperation = "lighter";
	
	for(var m = 0, arrayLen = CD.meteors.length; m < arrayLen; m++) {
		var c_meteor = CD.meteors[m];
		
		for(var i = 0; i < c_meteor.particles.length; i++) {
			var p = c_meteor.particles[i];
			
			CD.context.beginPath();
			
			p.opacity = Math.round(p.remaining_life/p.life*100)/100; //changing opacity according to the life, opacity goes to 0 at the end of life of a particle
			
			var gradient = CD.context.createRadialGradient(p.location.x, p.location.y, 0, p.location.x, p.location.y, p.radius); //a gradient instead of white fill
			gradient.addColorStop(0, "rgba("+p.r+", "+p.g+", "+p.b+", "+p.opacity+")");
			gradient.addColorStop(0.5, "rgba("+p.r+", "+p.g+", "+p.b+", "+p.opacity+")");
			gradient.addColorStop(1, "rgba("+p.r+", "+p.g+", "+p.b+", 0)");
			
			CD.context.fillStyle = gradient;
			CD.context.arc(p.location.x, p.location.y, p.radius, Math.PI*2, false);
			CD.context.fill();
			
			p.remaining_life-=1;
			p.radius-=1;
			p.location.x += p.speed.x;
			p.location.y += p.speed.y;
			
			c_meteor.location.x += c_meteor.speed.x;
			c_meteor.location.y += c_meteor.speed.y;
			
			if (c_meteor.location.x <= -100 || c_meteor.location.y > (GE.windowHeight+200)){
				CD.meteors[m] = addMeteor();
			}else{
				if(p.remaining_life < 0 || p.radius < 0) {
					c_meteor.particles[i] = new MeteorParticle(c_meteor);
				}				
			}
			
		}
	}
	
}