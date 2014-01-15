var currentPage = 0,
	currentAuctionScope = 0,
	currentProfileScope = 0,
	currentInboxScope = 0,
	gameObjects = [],
	auctionObjects = [],
	inboxObjects = [],
	transactionObjects = [],
	pageObjects = [],
	verticaliScrolls = [],
	drawArcadeRequested = false,
	drawAuctionRequested = false,
	drawInboxRequested = false,
	drawTransactionsRequested = false,
	stopSignVisible = false,
	loggedIn = false,
	newMessages = 0,
	clickEvent = "click",
	Userpro = 0,
	profileSettingHTML = "";


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
	$(".homeScreenLogo").css({"height":($(window).width()*.5)});
  	$(".mainLI").css({"height":($(window).width()*.5)});
  	$(".arcadeLI").css({"height":($(window).width()*.5)});
  	$(".messageImage").css({"height":($(window).width()*.5)});
});

$(document).ready(function(){

	$(".homeScreenLogo").css({"height":($(window).width()*.5)});
	getData("arcade");
	getData("auctions");
	getData("inbox");
	hideFunctions();


	initializeVerticaliScroll(3, false);

});

// START home screen------------------------
function hideFunctions(){
	$(".peakAround").on(clickEvent, function(){
		event.preventDefault();
		$(".homeScreen").hide();
	});

	$("body").on(clickEvent, function(){
		if(stopSignVisible===true){
			hideStopSign();
		}
	});

	$(".backToHomeIcon").on(clickEvent, function(){
		//event.preventDefault();
		$(".loginWrapper").hide();
		$(".signupWrapper").hide();
		$(".homeScreenButtonWrapper").show();
	});

	$(".login.button").on(clickEvent, function(){
		event.preventDefault();
		$(".homeScreenButtonWrapper").hide();
		$(".loginWrapper").show();
	});

	$(".signUp.button").on(clickEvent, function(){
		event.preventDefault();
		$(".homeScreenButtonWrapper").hide();
		$(".signupWrapper").show();
	});

	$(".whatFor").on(clickEvent, function(){
		alert("Knowing the demographics of our fans helps us get better prizes for you. Also, certain prizes offered on Gratii have age restrictions. We will never share your personally identified information with any third party. Period.");
	})
	
	
}
// END home screen------------------------

// iScroll Functions-------------------------------

function initializeVerticaliScroll(pageIndex, snapTo){

	this.snapTo = snapTo;
	this.momentum = pageIndex==1?false:true;
	this.wrapperEl = "iScrollVerticalWrapper"+pageIndex;

	verticaliScrolls[pageIndex] = new iScroll(wrapperEl, { 
		snap: this.snapTo,
		hScrollbar: false, 
		vScrollbar: false, 
		lockDirection:true, 
		// useTransform: false, //<---Uncomment to save memory if crashing occurs
		momentum: this.momentum,
		onBeforeScrollStart: function (e) {
            var target = e.target;
            while (target.nodeType != 1) target = target.parentNode;

            if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA')
                e.preventDefault();
        }
	});
}

function initializeHorizontaliScroll(wrapperID){

	new iScroll(wrapperID, {
		snap: true,
		momentum: false,
		vScroll: false,
		hScrollbar: false,
		vScrollbar: false,
		lockDirection:true,
		onScrollEnd: function () {
			document.querySelector('#'+wrapperID+' #indicator > li.active').className = '';
			document.querySelector('#'+wrapperID+' #indicator > li:nth-child(' + (this.currPageX+1) + ')').className = 'active';
		}
	});
}
// End iScroll Functions-------------------------------


// start of Arcade-------------------------
var Game = function(val){ //Game object
	this.id = val.id;
	this.title = val.title;
	this.image = "images/arcade/"+val.image;
	this.challengeable = val.challengeable;
	this.challengeButtonBackground = val.challengeable?"url('../app/images/boxingGloves1.png')":"none";
	this.myHighScore = val.myHighScore;
	this.myTotalGratii = val.myTotalGratii;
	this.topTen = val.topTen;
	
	this.li = document.createElement('li');
	this.li.className = "mainLI vSnapToHere";
	this.li.id = "gameSnapWrapper_"+this.id;
	this.li.style.height = $(window).width()*.5;


	gameObjects.push(this);
}

Game.prototype.createDomElements = function(){ //Game draw method
	
	$("#arcade .games").append(this.li);

	this.scrollerDiv = document.createElement('div');
	this.scrollerDiv.id = "scroller";
	this.li.appendChild(this.scrollerDiv);

	this.arcadeFrameA = document.createElement('div');
	this.arcadeFrameA.className = "arcadeFrame";
	this.arcadeFrameA.id = "a";
	this.scrollerDiv.appendChild(this.arcadeFrameA);

	this.arcadeContent = document.createElement('div');
	this.arcadeContent.className = "arcadeContent";
	this.arcadeContent.style.backgroundImage = "url('"+this.image+"')";
	this.arcadeFrameA.appendChild(this.arcadeContent);

	if(this.challengeable==1){
		this.challengeButton = document.createElement('div');
		this.challengeButton.className = "challengeButton";
		this.challengeButton.style.backgroundImage = "url('"+this.challengeButtonBackground+"')";
		this.challengeButton.style.opacity = this.Userpro?1:.5;
		this.arcadeContent.appendChild(this.challengeButton);
	}
	
	this.arcadeFrameB = document.createElement('div');
	this.arcadeFrameB.className = "arcadeFrame";
	this.arcadeFrameB.id = "b";
	this.scrollerDiv.appendChild(this.arcadeFrameB);

	this.arcadeContent = document.createElement('div');
	this.arcadeContent.className = "arcadeContent";
	this.arcadeFrameB.appendChild(this.arcadeContent);

	this.myScores = document.createElement('div');
	this.myScores.className = "myScores";
	this.arcadeContent.appendChild(this.myScores);

	this.myHighScoreDiv = document.createElement('div');
	this.myHighScoreDiv.className = "myHighScore";
	this.myHighScoreDiv.innerHTML = "My best: "+this.myHighScore;
	this.myScores.appendChild(this.myHighScoreDiv);

	this.myTotalGratiiDiv = document.createElement('div');
	this.myTotalGratiiDiv.className = "myTotalGratii";
	this.myTotalGratiiDiv.innerHTML = "Gratii accumulated: "+this.myTotalGratii;
	this.myScores.appendChild(this.myTotalGratiiDiv);

	this.top10Table = document.createElement('table');
	this.top10Table.className = "top10";
	this.arcadeContent.appendChild(this.top10Table);

	for(var i=0;i<5;i++){
		
		this.row = document.createElement('tr');
		this.top10Table.appendChild(this.row);

		this.td = document.createElement('td');
		this.td.innerHTML = this.topTen[i].username+': '+this.topTen[i].score;
		this.row.appendChild(this.td);

		this.td = document.createElement('td');
		this.td.innerHTML = this.topTen[i+5].username+': '+this.topTen[i+5].score;
		this.row.appendChild(this.td);

	}

	this.indicatorUL = document.createElement('ul');
	this.indicatorUL.id = "indicator";
	this.li.appendChild(this.indicatorUL);

	this.activeLI = document.createElement('li');
	this.activeLI.className = "active";
	this.indicatorUL.appendChild(this.activeLI);

	this.inactiveLI = document.createElement('li');
	this.indicatorUL.appendChild(this.inactiveLI);

	initializeHorizontaliScroll('gameSnapWrapper_'+this.id);
}
// end of Arcade-------------------------



// start of Auctions-------------------------
var Auction = function(val){ //Game object
	this.id = val.id;
	this.title = val.title;
	this.client = val.client;
	this.bids = ""+val.bids+"";
	
	if(this.bids.slice(-1) == "1" && this.bids.slice(-2) != "11" ){
		this.bidCountGrammarText = "st";
	}else if(this.bids.slice(-1) == "2"){
		this.bidCountGrammarText = "nd";
	}else if(this.bids.slice(-1) == "3"){
		this.bidCountGrammarText = "rd";
	}else{
		this.bidCountGrammarText = "th";
	}

	this.leader = val.leader;
	this.currentBid = val.currentBid;
	this.image = "images/auctions/"+val.image;
	this.inputVisible = false;
	
	this.li = document.createElement('li');
	this.li.className = "mainLI vSnapToHere";
	this.li.id = "auctionSnapWrapper_"+this.id;
	this.li.style.height = $(window).width()*.5;
	
	auctionObjects.push(this);
}

Auction.prototype.placeBidClick = function(){

	if(loggedIn===false){
		showStopSign("anonPlaceBid");
	}
	
}

Auction.prototype.showBidInputs = function(){

	that = this.Auction;
	console.log(that.bidInfoDiv);

	event.stopPropagation();
	if(that.inputVisible === false){

		that.currentBidDiv.style.display = "none";
		that.auctionCoin.style.display = "none";

		that.newBidButton = document.createElement('div');
		that.newBidButton.className = "newBidButton";
		that.newBidButton.innerHTML = "Place bid";
		that.bidInfoDiv.appendChild(that.newBidButton);

		that.newBidInput = document.createElement('input');
		that.newBidInput.className = "newBidInput";
		that.newBidInput.type = "number";
		that.newBidInput.placeholder = that.currentBid;
		that.bidInfoDiv.appendChild(that.newBidInput);

		that.inputVisible = true;

		that.newBidButton.addEventListener(clickEvent, {
                             handleEvent:that.placeBidClick,                  
                             Auction:that}, false);


	}
}

Auction.prototype.removeBidInputs = function(){

	that = this.Auction;

	if(that.inputVisible === true){

		that.newBidInput.style.display = "none";
		that.newBidButton.style.display = "none";
		that.currentBidDiv.style.display = "";
		that.auctionCoin.style.display = "";

		that.inputVisible = false;

	}

}

Auction.prototype.createLiveAuction = function(){
	
	$("#auctions .auctions").append(this.li);

	this.scrollerDiv = document.createElement('div');
	this.scrollerDiv.id = "scroller";
	this.li.appendChild(this.scrollerDiv);

	this.auctionFrameDivA = document.createElement('div');
	this.auctionFrameDivA.className = "auctionFrame";
	this.auctionFrameDivA.id = "a";
	this.scrollerDiv.appendChild(this.auctionFrameDivA);

	this.auctionContent = document.createElement('div');
	this.auctionContent.className = "auctionContent";
	this.auctionContent.style.backgroundImage = "url('"+this.image+"')";
	this.auctionFrameDivA.appendChild(this.auctionContent);

	this.auctionFrameDivB = document.createElement('div');
	this.auctionFrameDivB.className = "auctionFrame";
	this.auctionFrameDivB.id = "b";
	this.scrollerDiv.appendChild(this.auctionFrameDivB);

	this.auctionContent = document.createElement('div');
	this.auctionContent.className = "auctionContent";
	this.auctionContent.innerHTML = "--The Deets Go Here--";
	this.auctionFrameDivB.appendChild(this.auctionContent);

	this.indicatorUL = document.createElement('ul');
	this.indicatorUL.id = "indicator";
	this.li.appendChild(this.indicatorUL);

	this.activeLI = document.createElement('li');
	this.activeLI.className = "active";
	this.indicatorUL.appendChild(this.activeLI);

	this.inactiveLI = document.createElement('li');
	this.indicatorUL.appendChild(this.inactiveLI);

	this.auctionTitleWrapperDiv = document.createElement('div');
	this.auctionTitleWrapperDiv.className = "auctionTitleWrapper";
	this.auctionTitleWrapperDiv.innerHTML = "live: "+this.client+" - "+this.title;
	$("#auctions .auctions").append(this.auctionTitleWrapperDiv);

	this.auctionStatsWrapperDiv = document.createElement('div');
	this.auctionStatsWrapperDiv.className = "auctionStatsWrapper";
	$("#auctions .auctions").append(this.auctionStatsWrapperDiv);

	this.auctionStatsContent = document.createElement('div');
	this.auctionStatsContent.className = "auctionStatsContent";
	this.auctionStatsWrapperDiv.appendChild(this.auctionStatsContent);

	this.leaderInfoDiv = document.createElement('div');
	this.leaderInfoDiv.className = "leaderInfoWrapper";
	this.auctionStatsContent.appendChild(this.leaderInfoDiv);

	
	this.bidsDiv = document.createElement('div');
	this.bidsDiv.className = "bidCount";
	if(this.bids > 0){
		this.bidsDiv.innerHTML = this.bids+this.bidCountGrammarText+" bid:";
	}else{
		this.bidsDiv.innerHTML = "No bids yet. Be the first!";
	}
	this.leaderInfoDiv.appendChild(this.bidsDiv);

	this.leaderDiv = document.createElement('div');
	this.leaderDiv.className = "leader";
	if(this.bids > 0){
		this.leaderDiv.style.color = "black";
		this.leaderDiv.innerHTML = this.leader;
	}else{
		this.leaderDiv.style.color = "grey";
		this.leaderDiv.innerHTML = "Tap the coin to bid -->";
	}
	this.leaderInfoDiv.appendChild(this.leaderDiv);
	

	this.bidInfoDiv = document.createElement('div');
	this.bidInfoDiv.className = "bidInfoWrapper";
	this.auctionStatsContent.appendChild(this.bidInfoDiv);

	this.auctionCoin = document.createElement('div');
	this.auctionCoin.className = "auctionCoin";
	this.bidInfoDiv.appendChild(this.auctionCoin);

	this.currentBidDiv = document.createElement('div');
	this.currentBidDiv.className = "currentBid";
	this.currentBidDiv.innerHTML = this.currentBid;
	this.bidInfoDiv.appendChild(this.currentBidDiv);

	this.bidInfoDiv.addEventListener(clickEvent, {
                             handleEvent:this.showBidInputs,                  
                             Auction:this}, false);

	this.scrollerDiv.addEventListener(clickEvent, {
                             handleEvent:this.removeBidInputs,                  
                             Auction:this}, false);

	this.auctionStatsWrapperDiv.addEventListener(clickEvent, {
                             handleEvent:this.removeBidInputs,                  
                             Auction:this}, false);

	initializeHorizontaliScroll('auctionSnapWrapper_'+this.id);

}

Auction.prototype.createUpnextAuction = function(){
	
	$("#auctions .auctions").append(this.li);

	this.scrollerDiv = document.createElement('div');
	this.scrollerDiv.id = "scroller";
	this.li.appendChild(this.scrollerDiv);

	this.auctionFrameDivA = document.createElement('div');
	this.auctionFrameDivA.className = "auctionFrame";
	this.auctionFrameDivA.id = "a";
	this.scrollerDiv.appendChild(this.auctionFrameDivA);

	this.auctionContent = document.createElement('div');
	this.auctionContent.className = "auctionContent";
	this.auctionContent.style.backgroundImage = "url('"+this.image+"')";
	this.auctionFrameDivA.appendChild(this.auctionContent);

	this.auctionFrameDivB = document.createElement('div');
	this.auctionFrameDivB.className = "auctionFrame";
	this.auctionFrameDivB.id = "b";
	this.scrollerDiv.appendChild(this.auctionFrameDivB);

	this.auctionContent = document.createElement('div');
	this.auctionContent.className = "auctionContent";
	this.auctionContent.innerHTML = "--The Deets Go Here--";
	this.auctionFrameDivB.appendChild(this.auctionContent);

	this.indicatorUL = document.createElement('ul');
	this.indicatorUL.id = "indicator";
	this.li.appendChild(this.indicatorUL);

	this.activeLI = document.createElement('li');
	this.activeLI.className = "active";
	this.indicatorUL.appendChild(this.activeLI);

	this.inactiveLI = document.createElement('li');
	this.indicatorUL.appendChild(this.inactiveLI);

	this.auctionTitleWrapperDiv = document.createElement('div');
	this.auctionTitleWrapperDiv.className = "auctionTitleWrapper";
	this.auctionTitleWrapperDiv.innerHTML = "upnext: "+this.client+" - "+this.title;
	$("#auctions .auctions").append(this.auctionTitleWrapperDiv);

	this.auctionStatsWrapperDiv = document.createElement('div');
	this.auctionStatsWrapperDiv.className = "auctionStatsWrapper";
	$("#auctions .auctions").append(this.auctionStatsWrapperDiv);

	initializeHorizontaliScroll('auctionSnapWrapper_'+this.id);

}

Auction.prototype.createPastAuction = function(){
	
	$("#auctions .auctions").append(this.li);

	this.scrollerDiv = document.createElement('div');
	this.scrollerDiv.id = "scroller";
	this.li.appendChild(this.scrollerDiv);

	this.auctionFrameDivA = document.createElement('div');
	this.auctionFrameDivA.className = "auctionFrame";
	this.auctionFrameDivA.id = "a";
	this.scrollerDiv.appendChild(this.auctionFrameDivA);

	this.auctionContent = document.createElement('div');
	this.auctionContent.className = "auctionContent";
	this.auctionContent.style.backgroundImage = "url('"+this.image+"')";
	this.auctionFrameDivA.appendChild(this.auctionContent);

	this.auctionFrameDivB = document.createElement('div');
	this.auctionFrameDivB.className = "auctionFrame";
	this.auctionFrameDivB.id = "b";
	this.scrollerDiv.appendChild(this.auctionFrameDivB);

	this.auctionContent = document.createElement('div');
	this.auctionContent.className = "auctionContent";
	this.auctionContent.innerHTML = "--The Deets Go Here--";
	this.auctionFrameDivB.appendChild(this.auctionContent);

	this.indicatorUL = document.createElement('ul');
	this.indicatorUL.id = "indicator";
	this.li.appendChild(this.indicatorUL);

	this.activeLI = document.createElement('li');
	this.activeLI.className = "active";
	this.indicatorUL.appendChild(this.activeLI);

	this.inactiveLI = document.createElement('li');
	this.indicatorUL.appendChild(this.inactiveLI);

	this.auctionTitleWrapperDiv = document.createElement('div');
	this.auctionTitleWrapperDiv.className = "auctionTitleWrapper";
	this.auctionTitleWrapperDiv.innerHTML = "past: "+this.client+" - "+this.title;
	$("#auctions .auctions").append(this.auctionTitleWrapperDiv);

	this.auctionStatsWrapperDiv = document.createElement('div');
	this.auctionStatsWrapperDiv.className = "auctionStatsWrapper";
	$("#auctions .auctions").append(this.auctionStatsWrapperDiv);

	initializeHorizontaliScroll('auctionSnapWrapper_'+this.id);

}


Auction.prototype.createDomElements = function(){
	if(currentAuctionScope===0){
		this.createLiveAuction();
	}else if(currentAuctionScope===1){
		this.createUpnextAuction();
	}else if(currentAuctionScope===2){
		this.createPastAuction();
	}
}
// end of Auctions-------------------------





// start of INBOX-------------------------
var Message = function(val){ //Game object
	this.id = val.id;
	this.title = val.title;
	this.sender = val.client;
	this.image = "images/auctions/"+val.image;
	this.type = val.type;
	this.text = val.text;
	this.opened = val.opened;

	this.li = document.createElement('li');
	this.li.className = "messageLI vSnapToHere";
	this.li.id = this.id;
	
	inboxObjects.push(this);

}

Message.prototype.openMessage = function(event)
{ 
	alert(this.Message.title);
    this.Message.div.style.backgroundImage = "url('images/boxingButton.png')";
}

Message.prototype.createUnopenedMessage = function(){
	
	$("#inbox .messages").append(this.li);

	this.div = document.createElement('div');
	this.div.className = "messageImage new";
	this.div.style.height = $(window).width()*.5;
	this.div.addEventListener("click", {
                                 handleEvent:this.openMessage,                  
                                 Message:this}, false);
	
	this.li.appendChild(this.div);

}

Message.prototype.createDomElements = function(){
	if(this.opened===0){
		this.createUnopenedMessage();
	}
}
// end of INBOX-------------------------



// start of TRANSACTIONS-------------------------
var Transaction = function(val){ //Game object
	this.id = val.id;
	this.timestamp = val.timestamp;
	this.description = val.description;
	this.gratiiChange = val.gratiiChange;
	this.deltaColor = this.gratiiChange>=0?"green":"red";
	this.balance = val.balance;
	this.gratiiCoin = "images/gratiiCoinIconiOSGradient.png";
	this.html = "";
	this.backgroundColor = transactionObjects.length%2?"#fcfcfc":"#f4fbff";

	this.li = document.createElement('li');
	this.li.className = "transactionLI";
	this.li.style.backgroundColor = this.backgroundColor;

	transactionObjects.push(this);
}

Transaction.prototype.createDomElements = function(){ 
	
	$("#profile .transactions").append(this.li);

	this.div = document.createElement('div');
	this.div.className = "transactionID";
	this.div.innerHTML = "id: "+this.id;
	this.li.appendChild(this.div);	

	this.div = document.createElement('div');
	this.div.className = "transactionTimestamp";
	this.div.innerHTML = this.timestamp;
	this.li.appendChild(this.div);	

	this.div = document.createElement('div');
	this.div.className = "transactionDescription";
	this.div.innerHTML = this.description+': <font style="color:'+this.deltaColor+';">'+this.gratiiChange+''+'</font>';
	this.li.appendChild(this.div);	

	this.div = document.createElement('div');
	this.div.className = "transactionCoin";
	this.li.appendChild(this.div);

	this.div = document.createElement('div');
	this.div.className = "transactionBalance";
	this.div.innerHTML = this.balance;
	this.li.appendChild(this.div);	

}

// end of TRANSACTIONS-------------------------




// start of UNIVERSAL DATA-------------------------
function createDomElementsFromObjects(dataRequested){
	console.log("Request to create DOM elements from Objects received: "+dataRequested+"...");
	
	if(dataRequested==="arcade"){
		
		for(var i=0;i<gameObjects.length;i++){
			gameObjects[i].createDomElements();
		}
		initializeVerticaliScroll(0, ".vSnapToHere");

	}else if(dataRequested==="auctions"){
		
		for(var i=0;i<auctionObjects.length;i++){
			auctionObjects[i].createDomElements();
		}
		initializeVerticaliScroll(1, ".vSnapToHere");

	}else if(dataRequested==="inbox"){
		
		for(var i=0;i<inboxObjects.length;i++){
			inboxObjects[i].createDomElements();
		}
		initializeVerticaliScroll(2, ".vSnapToHere");

	}else if(dataRequested==="transactions"){
		
		for(var i=0;i<transactionObjects.length;i++){ 
			transactionObjects[i].createDomElements();
		}
		initializeVerticaliScroll(3, false);

	}	

	console.log("DOM elements appended: "+dataRequested+"#");
}

function createObjects(dataRequested, data){

	console.log("Creating objects: "+dataRequested+"...");
	if(dataRequested==="arcade"){
	
		$.each(data, function(key, val){			
			new Game(val);
		});
		createDomElementsFromObjects(dataRequested)
	
	}else if(dataRequested==="auctions"){
		
		$.each(data, function(key, val){			
			new Auction(val);
		});
		createDomElementsFromObjects(dataRequested)
	
	}else if(dataRequested==="inbox"){
	
		$.each(data, function(key, val){			
			new Message(val);
		});
		createDomElementsFromObjects(dataRequested)
	
	}else if(dataRequested==="transactions"){
	
		$.each(data, function(key, val){			
			new Transaction(val);
		});
		createDomElementsFromObjects(dataRequested)
	
	}

}

function getData(dataRequested){
	console.log("Getting data: "+dataRequested+"...");

	if(dataRequested==="arcade"){

		gameObjects = []; 
		$.ajax({
	        url: 'js/arcade.json',
	        type: 'GET',
	        async: true,
	        cache: false,
	        timeout: 30000,
	        error: function(){
	        	console.log("Error getting data: "+dataRequested+"#");
	            return true;
	        },
	        success: function(data){ 
	            console.log("Data gotten: "+dataRequested+"#");
	            createObjects(dataRequested, data);
	        }
	    });

	}else if(dataRequested==="auctions"){

		if(currentAuctionScope===0){
			URL = 'js/liveAuctions.json';
		}else if(currentAuctionScope===1){
			URL = 'js/upnextAuctions.json';
		}else if(currentAuctionScope===1){
			URL = 'js/pastAuctions.json';
		}

		messageObjects = [];
		$.ajax({
	        url: URL,
	        type: 'GET',
	        async: true,
	        cache: false,
	        timeout: 30000,
	        error: function(){
	        	console.log("Error getting data: "+dataRequested+"#");
	            return true;
	        },
	        success: function(data){ 
	            console.log("Data gotten: "+dataRequested+"#");
	            createObjects(dataRequested, data);
	        }
	    });

	}else if(dataRequested==="inbox"){
		
		messageObjects = [];
		$.ajax({
	        url: 'js/inbox.json',
	        type: 'GET',
	        async: true,
	        cache: false,
	        timeout: 30000,
	        error: function(){
	        	console.log("Error getting data: "+dataRequested+"#");
	            return true;
	        },
	        success: function(data){ 
	            console.log("Data gotten: "+dataRequested+"#");
	            createObjects(dataRequested, data);
	        }
	    });

	}else if(dataRequested==="transactions"){
		
		messageObjects = [];
		$.ajax({
	        url: 'js/transactions.json',
	        type: 'GET',
	        async: true,
	        cache: false,
	        timeout: 30000,
	        error: function(){
	        	console.log("Error getting data: "+dataRequested+"#");
	            return true;
	        },
	        success: function(data){ 
	            console.log("Data gotten: "+dataRequested+"#");
	            createObjects(dataRequested, data);
	        }
	    });

	}  
}
// end of UNIVERSAL DATA-------------------------



// Change page functions-------------------------------
function dimAllNavItems(){ //Dim non-selected navItems
	console.log("Dimming all navItems...");
	$(".navItem").removeClass('active');
	console.log("Dimmed navItems#");
}

function highlightSelectedNavItem(selectedPage){ //Highlight selected navItem
	console.log("Highlighting .navItem("+selectedPage+")...");
	$(".navItem:eq("+selectedPage+")").addClass('active');
	console.log(".navItem("+selectedPage+") highlighted#");
}

function displayPage(selectedPage){ //Scroll to the new page	
	console.log("Switching to page "+selectedPage+"...");
	$(".mainApp").clearQueue();

	if(selectedPage === 0){
		$(".mainApp").animate({"marginLeft":"0px"}, 500);
	}else if(selectedPage === 1){
		$(".mainApp").animate({"marginLeft":"-100%"}, 500);
	}else if(selectedPage === 2){
		$(".mainApp").animate({"marginLeft":"-200%"}, 500);
	}else if(selectedPage === 3){
		$(".mainApp").animate({"marginLeft":"-300%"}, 500);
	}
	
	currentPage = selectedPage;	
	console.log("On page "+selectedPage+"#");
}

function changePage(selectedPage){
	dimAllNavItems();
	highlightSelectedNavItem(selectedPage);
	displayPage(selectedPage);
}

$(".navItem").on(clickEvent, function(){ //Mobile touch on navItem
	var selectedPage = $(this).index();
	if(selectedPage===currentPage){
		verticaliScrolls[currentPage].scrollTo(0, 0, 200);
		console.log('Already on this page');
		return;
	}
	
	changePage(selectedPage);

});
// End of Change page functions-------------------------------


// Auction Nav Functions--------------------
function dimAllAuctionScopes(){ //Dim non-selected navItems
	console.log("Dimming auction scopes...");
	$("#auctions .scopeButton").removeClass('active');
	console.log("Dimmed auction scopes#");
}

function highlightSelectedAuctionScope(selectedAuctionScope){ //Highlight selected navItem
	console.log("Highlighting .auctionScopeButton("+selectedAuctionScope+")...");
	$("#auctions .scopeButton:eq("+selectedAuctionScope+")").addClass('active');
	console.log("#auctions .scopeButton("+selectedAuctionScope+") highlighted#");
}

function displayAuctionScope(selectedAuctionScope){ //Scroll to the new page	
	
	console.log("Switching to auction scope "+selectedAuctionScope+"...");

	//load new scope here
	console.log("Loading new auction scope: "+selectedAuctionScope+"...");
	
	currentAuctionScope = selectedAuctionScope;	
	console.log("On auction scope "+selectedAuctionScope+"#");
}

function changeAuctionScope(selectedAuctionScope){
	dimAllAuctionScopes();
	highlightSelectedAuctionScope(selectedAuctionScope);
	
	displayAuctionScope(selectedAuctionScope);
	auctionObjects = [];
	$("#auctions .auctions").html('');
	getData("auctions");
}

$("#auctions .scopeButton").on(clickEvent, function(){ //Mobile touch on navItem
	var selectedAuctionScope = $(this).index();

	if(selectedAuctionScope===currentAuctionScope){
		console.log('Already on this page');
		return;
	}
	
	changeAuctionScope(selectedAuctionScope);

});

// End of Auction Nav Functions-------------


// Inbox Nav Functions--------------------
function dimAllInboxScopes(){ //Dim non-selected navItems
	console.log("Dimming inbox scopes...");
	$("#inbox .scopeButton").removeClass('active');
	console.log("Dimmed inbox scopes#");
}

function highlightSelectedInboxScope(selectedInboxScope){ //Highlight selected navItem
	console.log("Highlighting #inbox .scopeButton("+selectedInboxScope+")...");
	$("#inbox .scopeButton:eq("+selectedInboxScope+")").addClass('active');
	console.log("#inbox .scopeButton("+selectedInboxScope+") highlighted#");
}

function getInboxScope(selectedInboxScope){ //Scroll to the new page	
	
	console.log("Switching to inbox scope "+selectedInboxScope+"...");

	//load new scope here
	console.log("Loading new inbox scope: "+selectedInboxScope+"...");
	
	currentInboxScope = selectedInboxScope;	
	if(currentInboxScope===0){
		$(".send").toggle();
		$(".messages").toggle();
		verticaliScrolls[2].refresh();
	}else{
		$(".messages").toggle();
		$(".send").toggle();
		verticaliScrolls[2].refresh();
	}
	console.log("On inbox scope "+selectedInboxScope+"#");
}

function changeInboxScope(selectedInboxScope){
	dimAllInboxScopes();
	highlightSelectedInboxScope(selectedInboxScope);
	getInboxScope(selectedInboxScope);
	//getAndDrawProfile();
}

$("#inbox .scopeButton").on(clickEvent, function(){ //Mobile touch on navItem
	var selectedInboxScope = $(this).index();

	if(selectedInboxScope===currentInboxScope){
		console.log('Already on this page');
		return;
	}
	
	changeInboxScope(selectedInboxScope);

});
// End of Inbox Nav Functions-------------



// Profile Nav Functions--------------------
function dimAllProfileScopes(){ //Dim non-selected navItems
	console.log("Dimming profile scopes...");
	$("#profile .scopeButton").removeClass('active');
	console.log("Dimmed profile scopes#");
}

function highlightSelectedProfileScope(selectedProfileScope){ //Highlight selected navItem
	console.log("Highlighting .profileScopeButton("+selectedProfileScope+")...");
	$("#profile .scopeButton:eq("+selectedProfileScope+")").addClass('active');
	console.log(".profileScopeButton("+selectedProfileScope+") highlighted#");
}

function getProfileScope(selectedProfileScope){ //Scroll to the new page	
	
	console.log("Switching to profile scope "+selectedProfileScope+"...");

	//load new scope here
	console.log("Loading new profile scope: "+selectedProfileScope+"...");
	
	currentProfileScope = selectedProfileScope;
	if(currentProfileScope===0){
		verticaliScrolls[3].scrollTo(0,0,0);
		$(".transactions").toggle();
		$(".settings").toggle();
		verticaliScrolls[3].refresh();
	}else{
		$(".settings").toggle();
		transactionObjects = [];
		$(".transactions").html('');
		getData("transactions");
		$(".transactions").toggle();
	}
	console.log("On profile scope "+selectedProfileScope+"#");
}

function changeProfileScope(selectedProfileScope){
	dimAllProfileScopes();
	highlightSelectedProfileScope(selectedProfileScope);
	getProfileScope(selectedProfileScope);
}

$("#profile .scopeButton").on(clickEvent, function(){ //Mobile touch on navItem
	var selectedProfileScope = $(this).index();

	if(selectedProfileScope===currentProfileScope){
		console.log('Already on this page');
		return;
	}
	
	changeProfileScope(selectedProfileScope);

});
// End of Profile Nav Functions-------------

// start STOP SIGN-----------------
function showStopSign(){
	$(".stopSignWrapper").show(function(){
		$(".stopSignWrapper").animate({bottom:"51px"}, 500);
	});
	
	stopSignVisible = true;
}

function hideStopSign(){
	$(".stopSignWrapper").animate({bottom:"-300px"}, 500, function(){
		$(".stopSignWrapper").hide();
	});
	
	stopSignVisible = false;
}
// end STOP SIGN----------------


// Input Checkers--------------------
function textCounter(){

	var field = document.getElementById('textMessage');
	if ( field.value.length > 150 ) {
  		// field.value = field.value.substring( 0, maxlimit );
  		// return false;
  		$('#textMessage').css({"border":"1px solid red"});
  		$('#inbox .sendButton').css({"border":"2px solid red"});
  		return;
 	} else {
 		$('#'+field.id).css({"border":"none"});
  		$('#inbox .sendButton').css({"border":"1px solid blue"});
 	}
}
// End of Input Checkers--------------------

