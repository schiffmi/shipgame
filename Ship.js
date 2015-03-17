/* rotation: stackoverflow.com/questions/24244405/rotate-a-triangle-continuously 


*/

function Ship(position, canvasWidth, canvasHeight, color){
  this.color = color;
  this.nose = position;   
  this.speed = 0;
  this.movementAngle = 0;  
  this.angle = 0;
  var THRUST = 0.5;
  this.size = 25; 
  this.alive = true; 
  this.noseAngle = 30; // angle of tip of ship
  this.tail = Math.tan(toRadians(this.noseAngle / 2)) * this.size;
  this.side = this.size / Math.cos(toRadians(this.noseAngle / 2));
  this.tailPointA = [];
  this.tailPointB = [];
  this.tailPointAp = [];
  this.tailPointBp = [];
  this.centerX;
  this.centerY;
  this.canvasWidth = canvasWidth;
  this.canvasHeight = canvasHeight;
  this.maxSpeed = 7;
  this.accelerating = false;
  this.shotDelay = 200;
  this.lastShotTime = 0;
  
  
  this.logShip = function(){   
    result = "tailPointA: " + this.tailPointA;
    result += "\ntailPointB: " + this.tailPointB;
    result += "\ntail: " + this.tail;
    result += "\nsize: " + this.size;
    result += "\nnose: " + this.nose;
    result += "\nside: " + this.side;
    console.log(result);
  }
  
  this.calcBasePosition = function(){
      this.tailPointA = [this.nose[0] - this.size, this.nose[1] - this.tail];
      this.tailPointB = [this.nose[0] - this.size, this.nose[1] + this.tail];        
      this.rotateShip(0);    
      this.centerX = (this.nose[0] + this.tailPointAp[0] + this.tailPointBp[0]) / 3;
      this.centerY = (this.nose[1] + this.tailPointAp[1] + this.tailPointBp[1]) / 3; 
  }
  
  this.rotateShip = function(degree){    
    this.angle += degree;
    if(this.angle < 0) this.angle = 360 + this.angle;
    if(this.angle > 360) this.angle = 0 + (this.angle - 360);
    degree = toRadians(this.angle);
    /*A.x' = (A.x-B.x) * cos(C) - (A.y-B.y) * sin(C) + B.x
    A.y' = (A.y-B.y) * cos(C) + (A.x-B.x) * sin(C) + B.y*/
    this.tailPointAp[0] = (this.tailPointA[0] - this.nose[0]) * Math.cos(degree) - (this.tailPointA[1] - this.nose[1]) * Math.sin(degree) + this.nose[0];
    this.tailPointAp[1] = (this.tailPointA[1] - this.nose[1]) * Math.cos(degree) + (this.tailPointA[0] - this.nose[0]) * Math.sin(degree) + this.nose[1];
    this.tailPointBp[0] = (this.tailPointB[0] - this.nose[0]) * Math.cos(degree) - (this.tailPointB[1] - this.nose[1]) * Math.sin(degree) + this.nose[0];
    this.tailPointBp[1] = (this.tailPointB[1] - this.nose[1]) * Math.cos(degree) + (this.tailPointB[0] - this.nose[0]) * Math.sin(degree) + this.nose[1];
    
  }
  
  this.accelerate = function(positive){   
    this.accelerating = true; 
    var mvAngleRad = toRadians(this.movementAngle);
    var angleRad = toRadians(this.angle);
    
    //get vectors
    var currentVectorX = Math.cos(mvAngleRad) * this.speed;
    var currentVectorY = Math.sin(mvAngleRad) * this.speed;    
    var thrustVectorX = Math.cos(angleRad) * THRUST;
    var thrustVectorY = Math.sin(angleRad) * THRUST;
      // add vectors
    var sumX = currentVectorX + thrustVectorX;
    var sumY = currentVectorY + thrustVectorY;
    var newSpeed = Math.sqrt(Math.pow(sumX, 2) + Math.pow(sumY, 2));        
    var newMvmtAngle = toDegrees(Math.atan2(sumY, sumX));    
    
    this.speed = (newSpeed > this.maxSpeed) ? this.maxSpeed : newSpeed;
    this.movementAngle = newMvmtAngle;
  }
  
  this.moveShip = function(){
   // this.accelerating = false;
    this.speed *= 0.993; // friction
    var velX = Math.cos(toRadians(this.movementAngle)) * this.speed;
    var velY = Math.sin(toRadians(this.movementAngle)) * this.speed;     
      this.nose[0] += velX;
      this.nose[1] += velY;
     
      if(this.nose[0] < 0) this.nose[0]=  this.canvasWidth + this.nose[0];
    if(this.nose[0] > this.canvasWidth) this.nose[0] = 0 + (this.nose[0] - this.canvasWidth);
    if(this.nose[1] < 0) this.nose[1] = this.canvasHeight + this.nose[1];
    if(this.nose[1] > this.canvasHeight) this.nose[1] = 0 + (this.nose[1] - this.canvasHeight);
       
    this.calcBasePosition();
  }
  
  this.drawShip = function(ctx){               
    //ctx.fillRect(this.centerX - this.size/2, this.centerY-this.size/2, this.size-2, this.size-2);
    if(this.alive){
      ctx.beginPath();
      ctx.moveTo(this.nose[0], this.nose[1]);
      ctx.lineTo(this.tailPointAp[0], this.tailPointAp[1]);
      ctx.lineTo(this.tailPointBp[0], this.tailPointBp[1]);
      ctx.lineTo(this.nose[0], this.nose[1]);
      ctx.closePath();
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.strokeStyle= "#000";    
      ctx.stroke(); 
      
      if(this.accelerating){      
        var x =   this.nose[0] + (35 * Math.cos(toRadians(this.angle - 180)));
        var y =   this.nose[1] + (35 * Math.sin(toRadians(this.angle - 180))); 
        ctx.beginPath();     
        ctx.moveTo(this.tailPointAp[0], this.tailPointAp[1]);
        ctx.lineTo(x, y);
        ctx.lineTo(this.tailPointBp[0], this.tailPointBp[1]);
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle = "orange";
        ctx.fill();
      }
    } 
    else{
        ctx.fillStyle = "black";
        ctx.font = "bold 16px Arial";
        ctx.fillText("X", this.centerX, this.centerY)
        
    }   
    this.accelerating = false;    
       
  }  
  this.calcBasePosition();
  
  this.shoot = function(){
    d = new Date();
    if(d.getTime() - this.lastShotTime > this.shotDelay){
      this.lastShotTime = d.getTime();
      return new Bullet(this.nose, this.angle, this.canvasWidth, this.canvasHeight, this);
    }
    return false;
  }    
}  



function toRadians(angle){
  return angle * (Math.PI / 180);
}  
function toDegrees(radian){
  return radian * (180 / Math.PI); 
}    
