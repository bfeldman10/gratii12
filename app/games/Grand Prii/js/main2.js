var previousTileColor = "white",
	previousTileMarginLeft = 5,
	tilesArray = new Array(),
	mainContentArea,
	k=0,
	tileWidth = 90,
	tileHeight = 10,
	gamePaused = false,
	addTile,
	maxTiles;

$(document).ready(function(){

	mainContentArea = $(".main");

	$("body").keydown(function(e) {
	    if(e.keyCode == 37) { // left
	    	$(".car").animate({marginLeft:"-=20"},0);
	 	}else if(e.keyCode == 39) { // right
	    	$(".car").animate({marginLeft:"+=20"},0);
	  	}
	});

	var bodyHeight = $(".main").height();
	alert(bodyHeight);

	maxTiles = Math.ceil(bodyHeight/tileHeight);
	for(q=0;q<=maxTiles;q++){
		new Tile();
	}
	alert(maxTiles);
	
	$(".left").on('touchstart', function(){
	    $(".car").animate({marginLeft:"-=20"},0);
	});
	$(".right").on('touchstart', function(){
	    $(".car").animate({marginLeft:"+=20"},0);
	});

	$(".gratiiCoin").click(function(){
	 	if(gamePaused==true){
	 		addTile = window.setInterval(function(){
			    new Tile();
			}, 50);
	 		gamePaused=false; 
	 		console.log(gamePaused);
	 	}else{
	 		window.clearInterval(addTile); 
	 		gamePaused=true; 
	 		console.log(gamePaused);
	 	}
	 		
	});

});

function Tile(){

	this.color = Tile.prototype.getColor();
	this.marginTop = 0;
	this.marginLeft = Tile.prototype.getRandomMarginLeft();
	this.tileWidth = tileWidth; 
	Tile.prototype.adjustMarginTopOfTiles();

	
	this.html = "<div class='tile' id='tile_"+k+"' style='height:"+tileHeight+"px; width:"+this.tileWidth+"%; position:absolute; margin-left:"+this.marginLeft+"%; margin-top:"+this.marginTop+"px;'>"+
					"<div class='tileLeft' style='float: left; background-color:"+this.color+"; height:100%; width:10px;'></div>"+
					"<div class='tileRight' style='float: right; background-color:"+this.color+"; height:100%; width:10px;'></div>"+
				"</div>";

	$(".main").append(this.html);
	k++;

}

Tile.prototype.getColor = function(){
	if(previousTileColor=="blue"){
		previousTileColor = "red";
		return "red";
	}else{
		previousTileColor = "blue";
		return "blue";
	}
};

Tile.prototype.getRandomMarginLeft = function(){
	var direction = Math.floor(Math.random() * 2);
	
	if(direction === 0 && previousTileMarginLeft>0){
		var newTileMarginLeft = previousTileMarginLeft-1;
		previousTileMarginLeft = newTileMarginLeft;
		return newTileMarginLeft;
	}else if(direction === 1 && previousTileMarginLeft+tileWidth<100){
		var newTileMarginLeft = previousTileMarginLeft+1;
		previousTileMarginLeft = newTileMarginLeft;
		return newTileMarginLeft;
	}else{
		return previousTileMarginLeft;
	}
};

Tile.prototype.adjustMarginTopOfTiles = function(){
	if( $(".tile").length > maxTiles ){
		$(".tile").first().remove();
	}
	
	$(".tile").each(function (){
		$(this).css({"marginTop":"+="+tileHeight+"px"});
	});
};

var addTile = window.setInterval(function(){
  new Tile();
}, 50);

var increaseDifficulty = window.setInterval(function(){
    if(tileWidth > 20){
 		tileWidth -= .5;
 	}
}, 500);

var collisionCheck = windown.setInterval(function(){
	
}, 100);