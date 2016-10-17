function Boid(loc, vel, acc, clr, id) {
  this.acc = acc;
  this.vel = vel;
  this.loc = loc;
  this.clr = clr;
  this.id = id;
  this.repMult = .1;
  this.atrMult = 2.5;
  this.velLimit = 5;
  this.maxforce = 1;
  this.isIn;


  Boid.prototype.run = function(boids) {
      this.isIn=inside([this.loc.x,this.loc.y],poly);
      if(!this.isIn){
        this.flock(boids);
      }
      this.update();
      this.checkEdges();
      this.render();
    }
  Boid.prototype.seek = function(target) {
    var desired = p5.Vector.sub(target, this.loc); // A vector pointing from the location to the target
    // Normalize desired and scale to maximum speed
    desired.normalize();
    desired.mult(this.velLimit);
    // Steering = Desired minus Velocity
    var steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxforce); // Limit to maximum steering force
    return steer;
  }
  Boid.prototype.separate = function(boids) {
    var desiredseparation = 25.0;
    var steer = createVector(0, 0);
    var count = 0;
    // For every boid in the system, check if it's too close
    for (var i = 0; i < boids.length; i++) {
      var d = p5.Vector.dist(this.loc, boids[i].loc);
      // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
      if ((d > 0) && (d < desiredseparation)) {
        // Calculate vector pointing away from neighbor
        var diff = p5.Vector.sub(this.loc, boids[i].loc);
        diff.normalize();
        diff.div(d); // Weight by distance
        steer.add(diff);
        count++; // Keep track of how many
      }
    }
    // Average -- divide by how many
    if (count > 0) {
      steer.div(count);
    }

    // As long as the vector is greater than 0
    if (steer.mag() > 0) {
      // Implement Reynolds: Steering = Desired - Velocity
      steer.normalize();
      steer.mult(this.velLimit);
      steer.sub(this.vel);
      steer.limit(this.maxforce);
    }
    return steer;
  }
  Boid.prototype.align = function(boids) {
    var neighbordist = 50;
    var sum = createVector(0, 0);
    var count = 0;
    for (var i = 0; i < boids.length; i++) {
      var d = p5.Vector.dist(this.loc, boids[i].loc);
      if ((d > 0) && (d < neighbordist)) {
        sum.add(boids[i].vel);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(this.velLimit);
      var steer = p5.Vector.sub(sum, this.vel);
      steer.limit(this.maxforce);
      return steer;
    } else {
      return createVector(0, 0);
    }
  }
  Boid.prototype.cohesion = function(boids){
    var neighbordist = 50;
    var sum = createVector(0, 0); // Start with empty vector to accumulate all locations
    var count = 0;
    for (var i = 0; i < boids.length; i++) {
      var d = p5.Vector.dist(this.loc, boids[i].loc);
      if ((d > 0) && (d < neighbordist)) {
        sum.add(boids[i].loc); // Add location
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      return this.seek(sum); // Steer towards the location
    } else {
      return createVector(0, 0);
    }
  }
  Boid.prototype.flock = function(boids) {
    var sep = this.separate(boids); // Separation
    var ali = this.align(boids);    // Alignment
    var coh = this.cohesion(boids); // Cohesion
    // Arbitrarily weight these forces
    sep.mult(2.5);
    ali.mult(4.0);
    coh.mult(1.0);
    // Add the force vectors to acceleration
    this.applyForce(sep);
    this.applyForce(ali);
    this.applyForce(coh);
    }


  this.render = function() {
    fill(this.clr);
    stroke(255);
    ellipse(this.loc.x, this.loc.y, 8, 8);
  }
  this.update = function() {

    //Change force if  repellor is in range
    var isIn=collideCirclePoly(this.loc.x,this.loc.y,8,poly)||inside([this.loc.x,this.loc.y],poly);
    if(this.isIn){

      this.atrMult=2.5;
     if(this.loc.dist(repellor.loc) < 100){
      this.force = p5.Vector.sub(this.loc, repellor.loc);
      this.force.normalize();
      this.repMult = 2;
      this.velLimit = 3;
    }
      if(this.loc.dist(repellor.loc) < 50) {
        this.repMult = 3;
        this.velLimit = 2;
      }
      if(mouseIsPressed){
  			this.repMult=5;
        this.atrMult=0;
  			println(this.repMult);

      }
      this.force.mult(this.repMult);
      this.applyForce(this.force);
      this.velLimit = 5;
    }

    //Change force if  repellor is in range
    if(this.loc.dist(attractor.loc) < 200&&this.isIn){
      this.force = p5.Vector.sub( attractor.loc, this.loc);
      this.force.normalize();
      this.force.mult(this.atrMult);
      this.applyForce(this.force);
      this.velLimit = 5;
    }

    this.vel.add(acc);
    this.loc.add(this.vel);
    this.vel.limit(this.velLimit);
    this.acc.mult(0);
  }
  this.checkEdges = function() {
    if (this.loc.x > width || this.loc.x < 0) this.vel.x *= (-1);
    if (this.loc.y > height || this.loc.y < 0) this.vel.y *= (-1);
  }
}
