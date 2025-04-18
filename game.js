var rot;
var r = 30;
var l = 40;
speed = 2.1;
delay = 2.8;
time = 0;
score = 0;
highScore = 0;
deltaTime = 0;
ammo = 5;
var bullets = [];
var balls = [];

function setup(){
  

  const canvasElt = createCanvas(400, 715).elt;
  canvasElt.style.width = '100%', canvasElt.style.height = '100%';
  rot = createVector(0,1);
}

function draw (){
  if(frameCount > 1)
      deltaTime = 1/frameRate();
  else
      deltaTime = 0;
  background(50);
  noStroke();
  textSize(60);
  textAlign(CENTER);
  fill(255,100);
  text(score,2*width/6,60);
  fill(255);
  text(highScore,4*width/6,60);

  fill(50,200,100);
  ellipse(width/2,height/2,2*r);

  rot.rotate(speed*deltaTime);
  push();
  translate(width/2,height/2);
  rotate(rot.heading());
  stroke(250);
  strokeWeight(3);
  line(0,0,l,0);
  pop();

  for(bullet of bullets){
      bullet.show();
      bullet.update();
      bullet.restrict();
      for(ball of balls)
          bullet.struck(ball);
  }
  for(ball of balls){
      ball.show();
      ball.update();
      ball.restrict();
  }

  spawn();
  if(score > highScore){
    highScore = score;
  }
  for(var i = balls.length-1;i >= 0;i--){
      if(balls[i].hit)
          balls.splice(i,1);
  }
  for(var i = bullets.length-1;i >= 0;i--){
      if(bullets[i].hit)
          bullets.splice(i,1);
  }
}

function touchStarted(){
  let fs = fullscreen();
  if(!fs)
  fullscreen(true);
  var dx = cos(rot.heading())*l;
  var dy = sin(rot.heading())*l;
  if(ammo > 0){
    bullets.push(new Bullet(width/2+dx,height/2+dy,rot));
    ammo--;
  }
  return false;
}

function timeCount(){
    ammo+=3;
}
setInterval(timeCount,6000);


function spawn (){
    time += deltaTime;
    if(time > delay){
        balls.push(new Ball());
        time = 0;
    }
}

function Bullet (x,y,rot){
    this.pos = createVector(x,y);
    this.vel = createVector();
    this.speed = 700;
    this.vel = rot.copy();

    this.hit = false;

    this.update = function (){
        this.vel.setMag(this.speed*deltaTime);
        this.pos.add(this.vel);
    }

    this.show = function(){
        fill(0,0,255);
        noStroke();
        ellipse(this.pos.x,this.pos.y,10);
    }

    this.struck = function(ball){
        var d = dist(this.pos.x,this.pos.y,ball.pos.x,ball.pos.y);
        if(d < ball.r){
            this.hit = true;
            ball.hit = true;
            score++;
        }
    }
    this.restrict = function(){
        if(this.pos.y > height || this.pos.y < 0 || this.pos.x > width || this.pos.x < 0){
            this.hit = true;
        }
    }
}

function Ball (){
    var y1 = random()<0.5?5:height-5;
    var x1 = random()<0.5?5:width-5;
    var x2 = random(width);
    var y2 = random(height);
    this.speed = 70;
    this.hit = false;
    this.r = 25;
    this.pos = random()<0.5?createVector(x1,y2):createVector(x2,y1);
    this.vel = p5.Vector.sub(createVector(width/2,height/2),this.pos);
    this.vel.setMag(this.speed);

    this.update = function(){
        this.vel.setMag(this.speed*deltaTime);
        this.pos.add(this.vel);
    }

    this.show = function(){
        fill(255);
        noStroke();
        strokeWeight(2);
        ellipse(this.pos.x,this.pos.y,this.r*2);
    }

    this.restrict = function(){
      var d = dist(this.pos.x,this.pos.y,width/2,height/2);
      if(d < r + this.r/2){
        this.hit = true;
        fill(255,0,0);
        ellipse(width/2,height/2,2*r);
        score = 0;
        ammo = 5;
      }
    }

}
