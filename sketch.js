var numBoids = 200;
var boids = [];
var length = boids.length;
var randomPoly = []
var hit = false;
var poly = [];
var pred;

function setup() {
	var cnv = createCanvas(1100, 900);
	var x = (windowWidth - width) / 2;
	var y = (windowHeight - height) / 2;
	cnv.position(x, y);

	stroke(200, 200, 0);
	fill(200, 200, 0);

	Boid.prototype = new Mover();
	loadBoids();
	loadPoly();
	//collideDebug(true)





}

function draw() {
	background(50, 30, 137);
	//fill(10, 40, 30, 24);
	//rect(0, 0, width, height);
	drawPoly();
	runBoids();
  //ellipse(423, 431, 6,6);
	//ellipse(423, 431, 6,6);


}

function loadPoly(){
	poly[0] = createVector(423,431);
	poly[1] = createVector(310,311);
	poly[2] = createVector(320,223);
	poly[3] = createVector(420,123);
	poly[4] = createVector(690,233);
  poly[5] = createVector(600,333);
}
function drawPoly(){
	fill(10,20,80,50);
	beginShape();
	for(i=0; i < poly.length; i++){
		vertex(poly[i].x,poly[i].y);
	}
	endShape(CLOSE);

	ellipse(mouseX,mouseY,45,45);

	hit = collideCirclePoly(mouseX,mouseY,45,poly)||inside([mouseX,mouseY],poly);

	//enable the hit detection if the circle is wholly inside the polygon
	// hit = collideCirclePoly(mouseX,mouseY,45,poly,true);
	textSize(24);
	stroke(200, 100, 50);
	fill(200, 200, 50);
  text("Hit = " + hit, 300, 400);

}
function loadBoids() {
	// create an attractor an set values
	attractor = new Mover();
	attractor.rad = 30;
	// create an repellor an set values
	repellor = new Mover();
	repellor.clr = color(255,50,0);
	for (var i = 0; i < numBoids; i++) {
		var loc = createVector(random(width), random(height));
		var vel = createVector(random(-3, 3), random(-3,3));
		var acc = createVector(0,0);
		var clr = color(120,50,200);
		boids.push(new Boid(loc, vel, acc, clr, i));
	}
}

function runBoids() {
	attractor.run();
	repellor.run();

	for (var i = 0; i < boids.length; i++) {
		boids[i].run(boids);
	}
}

setInterval(changeAttAcc, 1000);
setInterval(changeRepAcc, 1500);

function changeAttAcc() {
	attractor.acc = createVector(random(-.3, .3), random(-.3, .3));
}
function changeRepAcc() {
	repellor.acc = createVector(random(-.3, .3), random(-.3, .3));
}
function inside(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i].x, yi = vs[i].y;
        var xj = vs[j].x, yj = vs[j].y;

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
}
