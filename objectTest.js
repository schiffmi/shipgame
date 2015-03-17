function Ship(position){
  this.position = position;
  
  this.logPosition = function(){   
    var result = "X: " + position[0] + " Y: " + position[1];
    console.log(result);
  }
}  

var ship = new Ship([0, 5]);
ship.logPosition();