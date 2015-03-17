// canvasTest.js
$(document).ready(function(){
  var canvasElement = $("#board")[0];
  var canvas = canvasElement.getContext("2d");
  var CANVAS_WIDTH = canvasElement.width;
  var CANVAS_HEIGHT = canvasElement.height;
  var FPS = 60;
  console.log("Canvas width: " + CANVAS_WIDTH + "\tCanvas Height: " + CANVAS_HEIGHT);
  // check for keys
  var pressed={};
  $(document).keydown(function(e){
     e = e || window.event;
     pressed[e.keyCode] = true;     
  });
  $(document).keyup(function(e){
     e = e || window.event;
     delete pressed[e.keyCode];
  });  
  
  
  // create objects
  var ships = [new Ship([200, 200], CANVAS_WIDTH, CANVAS_HEIGHT, "blue"), new Ship([100, 50], CANVAS_WIDTH, CANVAS_HEIGHT, "red")];
  var bullets = [];
  draw = function(){
    canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    for(index = 0, len = ships.length; index < len; index++){
      ships[index].drawShip(canvas);
    }
    bullets.forEach(function(bullet){
      bullet.draw(canvas);
    });
    
  }
  update = function(){   
    
    // ship 1
    if (pressed[37]){ ships[0].rotateShip(-5); }
    if (pressed[39]){ ships[0].rotateShip(5); }
    if (pressed[38]){ ships[0].accelerate(true); }
    // if (pressed[40]){ ships[0].accelerate(false); } DOWN
    if (pressed[96]){ 
      bullet = ships[0].shoot();
      if(bullet) bullets.push(bullet);
    } //numpad0
    // ship 2
    if (pressed[65]){ ships[1].rotateShip(-5); }
    if (pressed[68]){ ships[1].rotateShip(5); }
    if (pressed[87]){ ships[1].accelerate(true); }
    //if (pressed[83]){ ships[0].accelerate(false); } S
    if (pressed[32]){ 
      bullet = ships[1].shoot();
      if(bullet) bullets.push(bullet);
    } //SPACE
    
    
    for(index = 0, len = ships.length; index < len; index++){
      ships[index].moveShip();
    } 
    
    bullets.forEach(function(bullet){
      bullet.update();
    });
    bullets = bullets.filter(function(bullet) {
      return bullet.active;
    });  
    
    handleCollisions(); 
  }    
  
  collides = function(a, b){
    return ! (
		(a.centerY + a.size/2 < b.centerY - b.size/2) ||
		(a.centerY - a.size/2 > b.centerY + b.size/2) ||
		(a.centerX - a.size/2 > b.centerX + b.size/2) ||
		(a.centerX + a.size/2 < b.centerX - b.size/2) );    
  }
  
  handleCollisions = function(){
    // check ships collide
    if(collides(ships[0], ships[1]) || collides(ships[1], ships[0])){
      console.log("BOOM");
      ships[0].alive = false;
      ships[1].alive = false;
    }
    
    // bullets
    bullets.forEach(function(bullet) {
      ships.forEach(function(ship) {
        if (ship != bullet.owner && collides(bullet, ship)) {
          console.log("HIT");
          ship.alive = false;
          bullet.active = false;
        }
      });
    });  
  }
      
  
  // game fps
  setInterval(function(){
    update();
    draw();    
    }, 1000/FPS);
});