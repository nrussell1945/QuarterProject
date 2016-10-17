function Mover() {
	this.force = createVector(0,0);
	this.acc = createVector(random(.1, .9), random(-.9, .1));
	this.vel = createVector(0, 0);//random(-3, 3), random(-3, 3));
	this.loc = createVector(460, 280);
	this.clr = color(20, 200,50);//Default color
	this.rad = 20;
	this.idNum = 0;
}

Mover.prototype.run = function() {
	this.update();
	this.checkEdges();
	this.render();
}

Mover.prototype.render = function() {
	fill(this.clr);
	ellipse(this.loc.x, this.loc.y, this.rad, this.rad);
}

Mover.prototype.update = function() {
	//this.vel.add(this.acc);
	//this.vel.limit(2);
	//this.loc.add(this.vel);
}

Mover.prototype.checkEdges = function() {
	if (this.loc.x > width) this.loc.x = 0;
	if (this.loc.x < 0) this.loc.x = width;
	if (this.loc.y > height) this.loc.y = 0;
	if (this.loc.y < 0) this.loc.y = height;
}

Mover.prototype.applyForce = function(f) {
		this.acc.add(f);
	}
