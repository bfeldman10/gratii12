var currentPage = 0,
	currentAuctionScope = 0,
	currentProfileScope = 0,
	gameObjects = [],
	auctionObjects = [],
	drawArcadeRequested = false,
	drawAuctionRequested = false,
	clickEvent = "click",
	Userpro = 0;


function is_touch_device() {

  return 'ontouchstart' in window // works on most browsers 
      || 'onmsgesturechange' in window; // works on ie10
};

if(is_touch_device()){
	clickEvent = 'touchstart';
}else{
	clickEvent = 'click';
}

$(document).bind('touchmove', function(e) {
	e.preventDefault();
});

$(window).resize(function() {
  	$(".auctionLI").css({"height":($(window).width()*.5)});
  	$(".arcadeLI").css({"height":($(window).width()*.5)});
});

$(document).ready(function(){

	getAndDrawArcade();
	getAndDrawAuctions();
	initializeiScroll2();
	initializeiScroll3();

});

// iScroll Functions-------------------------------
function pullDownArcade () {
	getAndDrawArcade();
}

function initializeiScroll0(){
	pullDownEl_0 = document.getElementById('pullDown0');
	pullDownOffset = pullDownEl_0.offsetHeight;

	myScroll0 = new iScroll('wrapper0', { 
		snap: '#scroller',
		hScrollbar: false, 
		vScrollbar: false, 
		lockDirection:true, 
		useTransition: true,
		topOffset: pullDownOffset,
		momentum: true,
		onRefresh: function () {
			if (pullDownEl_0.className.match('loading')) {
				pullDownEl_0.className = '';
				pullDownEl_0.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
			}
		},
		onScrollMove: function () {
			if (this.y > 70 && !pullDownEl_0.className.match('flip')) {
				pullDownEl_0.className = 'flip';
				pullDownEl_0.querySelector('.pullDownLabel').innerHTML = 'Release to refresh...';
				this.minScrollY = 0;
			} else if (this.y < 70 && pullDownEl_0.className.match('flip')) {
				pullDownEl_0.className = '';
				pullDownEl_0.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
				this.minScrollY = -pullDownOffset;
			}
		},
		onScrollEnd: function () {
			if (pullDownEl_0.className.match('flip')) {
				pullDownEl_0.className = 'loading';
				pullDownEl_0.querySelector('.pullDownLabel').innerHTML = 'Loading...';				
				pullDownArcade();	// Execute custom function (ajax call?)
			}
		}
	});
}

function pullDownAuctions () {
	getAndDrawAuctions();
}

function initializeiScroll1(){
	pullDownEl_1 = document.getElementById('pullDown1');
	pullDownOffset = pullDownEl_1.offsetHeight;

	myScroll1 = new iScroll('wrapper1', { 
		snap: '#scroller',
		hScrollbar: false, 
		vScrollbar: false, 
		lockDirection:true, 
		useTransition: true,
		topOffset: pullDownOffset,
		momentum: true,
		onRefresh: function () {
			$(".auctionScopeWrapper").css("opacity","1");
			if (pullDownEl_1.className.match('loading')) {
				pullDownEl_1.className = '';
				pullDownEl_1.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
			}
		},
		onScrollMove: function () {
			console.log(this.y);
			if(this.y < -60){
				console.log("YUP!");
				$(".auctionScopeWrapper").css("opacity",".9");
			}else if(this.y > -60){
				$(".auctionScopeWrapper").css("opacity","1");
			}

			if (this.y > 70 && !pullDownEl_1.className.match('flip')) {
				pullDownEl_1.className = 'flip';
				pullDownEl_1.querySelector('.pullDownLabel').innerHTML = 'Release to refresh...';
				this.minScrollY = 0;
			} else if (this.y < 70 && pullDownEl_1.className.match('flip')) {
				pullDownEl_1.className = '';
				pullDownEl_1.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
				this.minScrollY = -pullDownOffset;
			}
		},
		onScrollEnd: function () {
			if (pullDownEl_1.className.match('flip')) {
				pullDownEl_1.className = 'loading';
				pullDownEl_1.querySelector('.pullDownLabel').innerHTML = 'Loading...';				
				pullDownAuctions();	// Execute custom function (ajax call?)
			}
		}
	});
}

function initializeiScroll2(){
	myScroll2 = new iScroll('wrapper2', { hScrollbar: false, vScrollbar: false, lockDirection:true });
}

function pullDownProfile () {
	console.log("pullDownProfile...");
}

function initializeiScroll3(){
	pullDownEl_1 = document.getElementById('pullDown3');
	pullDownOffset = pullDownEl_1.offsetHeight;

	myScroll1 = new iScroll('wrapper3', { 
		snap: '#scroller',
		hScrollbar: false, 
		vScrollbar: false, 
		lockDirection:true, 
		useTransition: true,
		topOffset: pullDownOffset,
		momentum: true,
		onRefresh: function () {
			$(".profileScopeWrapper").css("opacity","1");
			if (pullDownEl_1.className.match('loading')) {
				pullDownEl_1.className = '';
				pullDownEl_1.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
			}
		},
		onScrollMove: function () {
			console.log(this.y);
			if(this.y < -60){
				console.log("YUP!");
				$(".profileScopeWrapper").css("opacity",".9");
			}else if(this.y > -60){
				$(".profileScopeWrapper").css("opacity","1");
			}

			if (this.y > 70 && !pullDownEl_1.className.match('flip')) {
				pullDownEl_1.className = 'flip';
				pullDownEl_1.querySelector('.pullDownLabel').innerHTML = 'Release to refresh...';
				this.minScrollY = 0;
			} else if (this.y < 70 && pullDownEl_1.className.match('flip')) {
				pullDownEl_1.className = '';
				pullDownEl_1.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
				this.minScrollY = -pullDownOffset;
			}
		},
		onScrollEnd: function () {
			if (pullDownEl_1.className.match('flip')) {
				pullDownEl_1.className = 'loading';
				pullDownEl_1.querySelector('.pullDownLabel').innerHTML = 'Loading...';				
				pullDownProfile();	// Execute custom function (ajax call?)
			}
		}
	});
}


function initiateSnapScroller_0(listItemID){

	new iScroll('arcadeSnap_'+listItemID, {
		snap: true,
		momentum: false,
		vScroll: false,
		hScrollbar: false,
		vScrollbar: false,
		lockDirection:true,
		onScrollEnd: function () {
			document.querySelector('#arcadeSnap_'+listItemID+' #indicator > li.active').className = '';
			document.querySelector('#arcadeSnap_'+listItemID+' #indicator > li:nth-child(' + (this.currPageX+1) + ')').className = 'active';
		}
	});
}

function initiateSnapScroller_1(listItemID){
	
	new iScroll('auctionSnap_'+listItemID, {
		snap: true,
		momentum: false,
		vScroll: false,
		hScrollbar: false,
		vScrollbar: false,
		lockDirection:true,
		onScrollEnd: function () {
			document.querySelector('#auctionSnap_'+listItemID+' #indicator > li.active').className = '';
			document.querySelector('#auctionSnap_'+listItemID+' #indicator > li:nth-child(' + (this.currPageX+1) + ')').className = 'active';
		}
	});
}

// End iScroll Functions-------------------------------


// Change page functions-------------------------------
function highlightSelectedNavItem(selectedPage){ //Highlight selected navItem
	console.log("Highlighting .navItem("+selectedPage+")...");
	$(".navItem:eq("+selectedPage+")").children().css("color","red");
	$(".navItem:eq("+selectedPage+")").children().css("opacity","1");
	console.log(".navItem("+selectedPage+") highlighted#");
}

function dimOtherNavItems(selectedPage){ //Dim non-selected navItems
	console.log("Dimming navItems other than .navItem("+selectedPage+")...");
	$(".navItem:eq("+selectedPage+")").siblings().children().css("color","blue");
	$(".navItem:eq("+selectedPage+")").siblings().children().css("opacity",".5");
	console.log("Dimmed navItems other than .navItem("+selectedPage+")#");
}

function changePage(selectedPage){ //Scroll to the new page	
	console.log("Switching to page "+selectedPage+"...");
	$(".main").clearQueue();

	if(selectedPage === 0){
		$(".main").animate({"marginLeft":"0px"}, 500);
	}else if(selectedPage === 1){
		$(".main").animate({"marginLeft":"-100%"}, 500);
	}else if(selectedPage === 2){
		$(".main").animate({"marginLeft":"-200%"}, 500);
	}else if(selectedPage === 3){
		$(".main").animate({"marginLeft":"-300%"}, 500);
	}
	
	currentPage = selectedPage;	
	console.log("On page "+selectedPage+"#");
}

function togglePage(selectedPage){
	highlightSelectedNavItem(selectedPage);
	dimOtherNavItems(selectedPage);
	changePage(selectedPage);
}

$(".navItem").on(clickEvent, function(){ //Mobile touch on navItem
	var selectedPage = $(this).index();
	if(selectedPage===currentPage){
		if(currentPage===0){
			var currentMyScroll = myScroll0;
		}else if(currentPage===1){
			var currentMyScroll = myScroll1;
		}else if(currentPage===2){
			var currentMyScroll = myScroll2;
		}else if(currentPage===3){
			var currentMyScroll = myScroll3;
		}
		currentMyScroll.scrollTo(0, 0, 200);
		console.log('Already on this page');
		return;
	}
	
	togglePage(selectedPage);

});
// End of Change page functions-------------------------------





// Arcade Object & Drawing Functions-------------------------
var Game = function(val){ //Game object
	this.id = val.id;
	this.title = val.title;
	this.image = "images/arcade/"+val.image;
	this.challengeable = val.challengeable;
	this.myHighScore = val.myHighScore;
	this.myTotalGratii = val.myTotalGratii;
	this.topTen = val.topTen;
	this.topTenHTML = this.createTopTenTable(this.topTen);
	this.html = "";
	gameObjects.push(this);
}

Game.prototype.createTopTenTable = function(topTen){
	topTenHTML = '<table class="top10">';
	// topTenHTML += '<tr>'+
	// 					'<td style="text-align:center;">MONTHLY TOP 10</td>'+
	// 				'</tr>';
	for(i=0; i<5;i++){
		topTenHTML += '<tr>'+
						'<td>'+escape(this.topTen[i].username)+': '+escape(this.topTen[i].score)+'</td>'+
						'<td>'+escape(this.topTen[i+5].username)+': '+escape(this.topTen[i+5].score)+'</td>'+
					'</tr>';
	}
	
	topTenHTML += '</table>';
	return topTenHTML;
}

Game.prototype.createGameHTML = function(){ //Game draw method
	this.html = 
	'<li id="arcadeSnap_'+escape(this.id)+'" class="arcadeLI" style="height:'+$(window).width()*.5+';">'+
		'<div id="scroller">'+
			'<div class="arcadeFrame" id="a">'+
				'<div class="arcadeContent" style="background-image:url('+escape(this.image)+');">'+
					'<div class="challengeable_'+escape(this.challengeable)+'" style="opacity:'+escape((Userpro?1:.7))+';">'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="arcadeFrame" id="b">'+
				'<div class="arcadeContent">'+
					'<div class="myScores">'+
						'<div class="myHighScore">My best: '+escape(this.myHighScore)+'</div>'+
						'<div class="myTotalGratii">Gratii accumulated: '+escape(this.myTotalGratii)+'</div>'+
					'</div>'+
					this.topTenHTML+
				'</div>'+
			'</div>'+
		'</div>'+
		'<ul id="indicator">'+
			'<li class="active"></li>'+
			'<li></li>'+
		'</ul>'+
	'</li>';
}

function drawArcadeList(){
	console.log("Drawing arcade list to the DOM...");

	console.log("Appending #arcade UL opener...");
	$("#arcade").append('<ul class="list" id="arcadeList" style="overflow:visible;">');

	console.log("Appending HTML for each Game object...");
	for(i=0;i<gameObjects.length;i++){
		console.log("Appending HTML for "+gameObjects[i].title+"...");
		$("#arcadeList").append(gameObjects[i].html);
		initiateSnapScroller_0(gameObjects[i].id);
		console.log("HTML for "+gameObjects[i].title+" appended#");
	}
	console.log("HTML for all Game objects appended#");

	$("#arcade").append('</ul>');
	console.log("#arcade UL closed#");
	initializeiScroll0();
	console.log("iScroll initialized#");
	console.log("Arcade list appended to page and ready#");
}

function createEachGameHTML(){
	console.log("Creating the HTML for each Game object...");
	for(i=0;i<gameObjects.length;i++){
		console.log("Creating the HTML for "+gameObjects[i].title+"...");
		gameObjects[i].createGameHTML();
		console.log("HTML for "+gameObjects[i].title+" created#");
	}
	console.log("HTML for all Game objects created#");

	drawArcadeList();
}

function createGameObjects(data){

	console.log("Creating Game objects...");
	$.each(data, function(key, val){
		console.log("Creating Game object for "+val.title+"...");
		new Game(val);
		console.log("Game object for "+val.title+" created#");
	});
	console.log("All Game objects created#");

	if(drawArcadeRequested===true){
		createEachGameHTML();
	}else{
		console.log("Not drawing arcade list#");
		return;
	}

}

function getArcadeData(){
	console.log("Getting arcade data...");

	$.ajax({
        url: "js/arcade.json",
        type: 'GET',
        async: true,
        cache: false,
        timeout: 30000,
        error: function(){
        	console.log("Error getting arcade data#");
            return true;
        },
        success: function(data){ 
            console.log("Arcade data gotten#")
            createGameObjects(data);
        }
    });
}

function getAndDrawArcade(){
	console.log("Preparing to get and draw arcade...");
	drawArcadeRequested = true;
	$('#arcadeList').remove();
	gameObjects = [];
	getArcadeData();
}
// End of Arcade Object & Drawing Functions-------------------------



// Auction Object & Drawing Functions-------------------------
var Auction = function(val){ //Game object
	this.id = val.id;
	this.title = val.title;
	this.client = val.client;
	this.image = "images/auctions/"+val.image;
	this.html = "";
	auctionObjects.push(this);
}

Auction.prototype.createLiveAuctionHTML = function(){ 
	this.html = 
	'<li id="auctionSnap_'+escape(this.id)+'" class="auctionLI" style="height:'+$(window).width()*.5+';">'+
		'<div id="scroller">'+
			'<div class="auctionFrame" id="a">'+
				'<div class="auctionContent" style="background-image:url('+escape(this.image)+');">'+
				'</div>'+
			'</div>'+
			'<div class="auctionFrame" id="b">'+
				'<div class="auctionContent">--The Deets Go Here--'+
				'</div>'+
			'</div>'+
		'</div>'+
		'<ul id="indicator">'+
			'<li class="active"></li>'+
			'<li></li>'+
		'</ul>'+
	'</li>'+
	'<div class="auctionTitleWrapper">live: '+this.client+" - "+this.title+
	'</div>'+
	'<div class="auctionStatsWrapper">'+
	'</div>';
}

Auction.prototype.createUpnextAuctionHTML = function(){ 
	this.html = 
	'<li id="auctionSnap_'+escape(this.id)+'" class="auctionLI" style="height:'+$(window).width()*.5+';">'+
		'<div id="scroller">'+
			'<div class="auctionFrame" id="a" style="height:100%">'+
				'<div class="auctionContent" style="background-color:black;background-image:url('+escape(this.image)+');color:black;height:100%;">'+
				'</div>'+
			'</div>'+
			'<div class="auctionFrame" id="b" style="background-color:yellow;color:black;height:100%;">--The Deets Go Here--'+
			'</div>'+
		'</div>'+
		'<ul id="indicator">'+
			'<li class="active"></li>'+
			'<li></li>'+
		'</ul>'+
	'</li>'+
	'<div class="auctionTitleWrapper">upnext: '+this.client+" - "+this.title+
	'</div>'+
	'<div class="auctionStatsWrapper">'+
	'</div>';
}

Auction.prototype.createPastAuctionHTML = function(){ 
	this.html = 
	'<li id="auctionSnap_'+escape(this.id)+'" class="auctionLI" style="height:'+$(window).width()*.5+';">'+
		'<div id="scroller">'+
			'<div class="auctionFrame" id="a" style="height:100%">'+
				'<div class="auctionContent" style="background-color:black;background-image:url('+escape(this.image)+');color:black;height:100%;">'+
				'</div>'+
			'</div>'+
			'<div class="auctionFrame" id="b" style="background-color:yellow;color:black;height:100%;">--The Deets Go Here--'+
			'</div>'+
		'</div>'+
		'<ul id="indicator">'+
			'<li class="active"></li>'+
			'<li></li>'+
		'</ul>'+
	'</li>'+
	'<div class="auctionTitleWrapper">past: '+this.client+" - "+this.title+
	'</div>'+
	'<div class="auctionStatsWrapper">'+
	'</div>';
}

function drawAuctionList(){
	console.log("Drawing auction list to the DOM...");

	console.log("Appending #auctions UL opener...");
	$("#auctions").append('<ul class="list" id="auctionList" style="overflow:visible;">');
	console.log("Appending HTML for each Auction object...");
	for(i=0;i<auctionObjects.length;i++){
		console.log("Appending HTML for "+auctionObjects[i].title+"...");
		$("#auctionList").append(auctionObjects[i].html);
		initiateSnapScroller_1(auctionObjects[i].id);
		console.log("HTML for "+auctionObjects[i].title+" appended#");
	}
	console.log("HTML for all Auction objects appended#");
	$("#auctions").append('</ul>');
	console.log("#auctions UL closed#");
	initializeiScroll1();
	console.log("iScroll initialized#");
	console.log("Auction list appended to page and ready#");
}

function createEachAuctionHTML(){
	console.log("Creating the HTML for each Auction object...");
	for(i=0;i<auctionObjects.length;i++){
		console.log("Creating the HTML for "+auctionObjects[i].title+"...");
		if(currentAuctionScope===0){
			auctionObjects[i].createLiveAuctionHTML();
		}else if(currentAuctionScope===1){
			auctionObjects[i].createUpnextAuctionHTML();
		}else if(currentAuctionScope===2){
			auctionObjects[i].createPastAuctionHTML();
		}
		
		console.log("HTML for "+auctionObjects[i].title+" created#");
	}
	console.log("HTML for all Auction objects created#");

	drawAuctionList();
}

function createAuctionObjects(data){

	console.log("Creating Auction objects...");
	$.each(data, function(key, val){
		console.log("Creating Auction object for "+val.title+"...");
		new Auction(val);
		console.log("Auction object for "+val.title+" created#");
	});
	console.log("All Auction objects created#");

	if(drawAuctionRequested===true){
		createEachAuctionHTML();
	}else{
		console.log("Not drawing auction list#");
		return;
	}

}

function getAuctionData(){
	console.log("Getting auction data...");

	if(currentAuctionScope===0){
		var URL = "js/liveAuctions.json";
	}else if(currentAuctionScope===1){
		var URL = "js/upnextAuctions.json";
	}else if(currentAuctionScope===2){
		var URL = "js/pastAuctions.json";
	}

	$.ajax({
        url: URL,
        type: 'GET',
        async: true,
        cache: false,
        timeout: 30000,
        error: function(){
        	console.log("Error getting auction data#");
            return true;
        },
        success: function(data){ 
            console.log("Auction data gotten#")
            createAuctionObjects(data);
        }
    });
}

function getAndDrawAuctions(){
	console.log("Preparing to get and draw auctions...");
	drawAuctionRequested = true;
	$('#auctionList').remove();
	auctionObjects = [];
	getAuctionData();
}
// End of Auction Object & Drawing Functions-------------------------





// Auction Nav Functions--------------------
function highlightSelectedAuctionScope(selectedAuctionScope){ //Highlight selected navItem
	console.log("Highlighting .auctionScopeButton("+selectedAuctionScope+")...");
	$(".auctionScopeButton:eq("+selectedAuctionScope+")").css("color","white");
	$(".auctionScopeButton:eq("+selectedAuctionScope+")").css("backgroundColor","blue");
	console.log(".auctionScopeButton("+selectedAuctionScope+") highlighted#");
}

function dimOtherAuctionScopes(selectedAuctionScope){ //Dim non-selected navItems
	console.log("Dimming auction scopes other than .auctionScopeButton("+selectedAuctionScope+")...");
	$(".auctionScopeButton:eq("+selectedAuctionScope+")").siblings().css("color","blue");
	$(".auctionScopeButton:eq("+selectedAuctionScope+")").siblings().css("backgroundColor","transparent");
	console.log("Dimmed auction scopes other than .auctionScopeButton("+selectedAuctionScope+")#");
}

function changeAuctionScope(selectedAuctionScope){ //Scroll to the new page	
	
	console.log("Switching to auction scope "+selectedAuctionScope+"...");

	//load new scope here
	console.log("Loading new auction scope: "+selectedAuctionScope+"...");
	
	currentAuctionScope = selectedAuctionScope;	
	console.log("On auction scope "+selectedAuctionScope+"#");
}

function toggleAuctionScope(selectedAuctionScope){
	highlightSelectedAuctionScope(selectedAuctionScope);
	dimOtherAuctionScopes(selectedAuctionScope);
	changeAuctionScope(selectedAuctionScope);
	getAndDrawAuctions();
}

$(".auctionScopeButton").on(clickEvent, function(){ //Mobile touch on navItem
	var selectedAuctionScope = $(this).index();

	if(selectedAuctionScope===currentAuctionScope){
		$( "#scroller" ).scrollTop( 0 );
		console.log('Already on this page');
		return;
	}
	
	toggleAuctionScope(selectedAuctionScope);

});

// End of Auction Nav Functions-------------



// Profile Nav Functions--------------------
function highlightSelectedProfileScope(selectedProfileScope){ //Highlight selected navItem
	console.log("Highlighting .profileScopeButton("+selectedProfileScope+")...");
	$(".profileScopeButton:eq("+selectedProfileScope+")").css("color","white");
	$(".profileScopeButton:eq("+selectedProfileScope+")").css("backgroundColor","blue");
	console.log(".profileScopeButton("+selectedProfileScope+") highlighted#");
}

function dimOtherProfileScopes(selectedProfileScope){ //Dim non-selected navItems
	console.log("Dimming profile scopes other than .profileScopeButton("+selectedProfileScope+")...");
	$(".profileScopeButton:eq("+selectedProfileScope+")").siblings().css("color","blue");
	$(".profileScopeButton:eq("+selectedProfileScope+")").siblings().css("backgroundColor","transparent");
	console.log("Dimmed profile scopes other than .profileScopeButton("+selectedProfileScope+")#");
}

function changeProfileScope(selectedProfileScope){ //Scroll to the new page	
	
	console.log("Switching to profile scope "+selectedProfileScope+"...");

	//load new scope here
	console.log("Loading new profile scope: "+selectedProfileScope+"...");
	
	currentProfileScope = selectedProfileScope;	
	console.log("On profile scope "+selectedProfileScope+"#");
}

function toggleProfileScope(selectedProfileScope){
	highlightSelectedProfileScope(selectedProfileScope);
	dimOtherProfileScopes(selectedProfileScope);
	changeProfileScope(selectedProfileScope);
	//getAndDrawProfile();
}

$(".profileScopeButton").on(clickEvent, function(){ //Mobile touch on navItem
	var selectedProfileScope = $(this).index();

	if(selectedProfileScope===currentProfileScope){
		$( "#scroller" ).scrollTop( 0 );
		console.log('Already on this page');
		return;
	}
	
	toggleProfileScope(selectedProfileScope);

});

// End of Profile Nav Functions-------------




// Function chain engine------------------
runFunctionChain = function(functionArray) {

    //extract the first function        
    var currentFunction = functionArray.splice(0, 1);

    //run it. and wait till its finished 
    currentFunction[0].promise().done(function() {
 
        //then call run animations again on remaining array
        if (functionArray.length > 0){
        	runFunctionChain(functionArray);
        }
    });
}
// End of function chain engine-------------




