function Ball() {
  this.loc = createVector(random(width), random(height));
  this.vel = createVector(random(-10, 10), random(-10, 10));
  this.rad = random(10, 30);
  this.clr = color(220, 150, 20);

  this.run = function() {
    this.move();
    this.bounce();
    this.render();

  }
  this.render = function() {
    //fill(this.clr);
    //ellipse(this.loc.x, this.loc.y, this.rad, this.rad);
  }

  this.bounce = function() {
    if (this.loc.x > width || this.loc.x < 0) {
      this.vel.x *= (-1);
    }

    if (this.loc.y > height || this.loc.y < 0) {
      this.vel.y *= -1
    }
  }

  this.move = function() {
    this.loc.add(this.vel);
    this.test=random(0,100);
    if(this.test<5){
      this.vel=createVector(random(-10,10), random(-10,10));
    }
  }

}
