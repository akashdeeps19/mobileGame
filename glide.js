var player;
var gravity = 8;
var force = 25;
var defDelay = 0.7;
var defSpeed = 200;
var speed = defSpeed;
var delay = defDelay;
var deltaTime;
var balls = [];
var time = 0;
var score = 0;
var highScore = 0;
var increased = false;

function setup(){
  const canvasElt = createCanvas(400, 720).elt;
  canvasElt.style.width = '100%', canvasElt.style.height = '100%';
  canvasElt.addEventListener("contextmenu", (e) => e.preventDefault());
  player = new Player();
}

function draw (){
  background(255);
  if(frameCount > 1)
      deltaTime = 1/frameRate();
  else
      deltaTime = 0;
//  rotate(-PI/4);
  player.show();
  player.update();
  player.restrict();

  for(ball of balls){
      ball.show();
      ball.update();
      ball.restrict();
  }
  spawn();

  noStroke();
  textSize(60);
  textAlign(CENTER);
  fill(25,100);
  text(score,2*width/6,60);
  fill(25);
  text(highScore,4*width/6,60);

  if(score > highScore){
    highScore = score;
  }

  if(score > 0 && score%20 == 0 && !increased){
    speed += 20;
    delay -= deltaTime*1.5;
    delay = constrain(delay,0.1,1);
    speed = constrain(speed,200,1000);
    increased = true;
  }
  else if(score == 0 || score%20 != 0) {
    increased = false;
  }

  for(var i = balls.length-1;i >= 0;i--){
      if(balls[i].p.pos.x < 0)
          balls.splice(i,1);
  }

  if(keyIsDown(32) || touches.length > 0){
    player.p.addForce(createVector(0,-force*deltaTime));
  }
}

function spawn (){
    time += deltaTime;
    if(time > delay){
        balls.push(new Ball());
        balls.push(new Ball());
        balls.push(new Ball());
        balls.push(new Ball());
        time = 0;
        score++;
    }
}

function touchStarted(){
  let fs = fullscreen();
  if(!fs)
  fullscreen(true);
}

function Player(){
  this.p = new Physics();
  this.p.pos.set(50,height/2);
  this.p.limit = 4;
  this.r = 10;

  this.show = function(){
    noStroke();
    fill(0,0,255);
    ellipse(this.p.pos.x,this.p.pos.y,this.r*2);
  }

  this.update = function(){
    this.p.update();
    this.p.addForce(createVector(0,gravity*deltaTime));
  }

  this.restrict = function(){
    if(this.p.pos.y > height || this.p.pos.y < 0){
      this.p.pos.y = abs(this.p.pos.y-height);
    }
  }
}

function Ball (){
    this.p = new Physics();
    var y1 = random()<0.5?5:height-5;
    var x1 = random()<0.5?5:width-5;
    var x2 = random(width);
    var y2 = random(height);
    this.p.pos.set(width,y2);
    this.speed = speed;
    this.hit = false;
    this.r = 25;

    this.update = function(){
      var vx = -this.speed;
      var vy = 0;
      this.p.vel.set(vx,vy);
      this.p.vel.setMag(this.speed*deltaTime);
      this.p.update();
    }
    this.show = function(){
        fill(250);
        if(this.hit)
          fill(255,0,0);
        noStroke();
        strokeWeight(2);
        ellipse(this.p.pos.x,this.p.pos.y,this.r*2);
    }

    this.restrict = function(){
      var d = dist(this.p.pos.x,this.p.pos.y,player.p.pos.x,player.p.pos.y);
      if(d < player.r + this.r){
        this.hit = true;
        score = 0;
        speed = defSpeed;
        delay = defDelay;
      }
    }

}
