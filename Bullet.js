function Bullet(position, angle, canvasWidth, canvasHeight, owner){
  this.position = [position[0], position[1]];
  this.speed = 10;
  this.angle = angle;
  this.color = "black";
  this.size = 4;  
  this.centerX = position[0] + this.size / 2;  
  this.centerY = position[1] + this.size / 2;
  this.canvasWidth = canvasWidth;
  this.canvasHeight = canvasHeight;
  this.active = true;
  this.owner = owner;
  
}

Bullet.prototype.update = function(){
  var velX = Math.cos(toRadians(this.angle)) * this.speed;
  var velY = Math.sin(toRadians(this.angle)) * this.speed;     
  this.position[0] += velX;
  this.position[1] += velY;
  this.centerX = this.position[0] + this.size / 2;  
  this.centerY = this.position[1] + this.size / 2;
  if(this.position[0] < 0) this.active = false;
  if(this.position[0] > this.canvasWidth) this.active = false;
  if(this.position[1] < 0) this.active = false;
  if(this.position[1] > this.canvasHeight) this.active = false;  
}

Bullet.prototype.draw = function(canvas){
  canvas.fillStyle = this.color;
  canvas.fillRect(this.position[0], this.position[1], this.size, this.size);

}  