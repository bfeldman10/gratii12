var currentPage = 0,
	currentAuctionScope = 0,
	currentProfileScope = 0,
	currentInboxScope = 0,
	secondsPerAuction = 1800,
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
	newMessages = 0;


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
	document.addEventListener("touchstart", function(){}, true);
	$(".homeScreenLogo").css({"height":($(window).width()*.5)});
	getData("session");
	getData("arcade");
	getData("auctions");
	getData("inbox");
	getData("transactions");
	hideFunctions();

	initializeVerticaliScroll(3, false);

});

// $("input, select, textarea").focus( function(){
// 	console.log('welp');
// 	$("input, select, textarea").not(this).prop('disabled', true);
// });

// $("input, select, textarea").blur( function(){
// 	$("input, select, textarea").not(this).prop('disabled', false);
// });

// START home screen------------------------
function hideFunctions(){
	$(".peakAround").on(clickEvent, function(){
		event.preventDefault();
		$(".homeScreen").hide();
	});

	$("#dimmer").on(clickEvent, function(){
		event.stopPropagation();
		if(stopSignVisible===true){
			hideStopSign();
		}
	});

	$("#arcade .cancelButton").on(clickEvent, function(){
		$("#arcade .challenge").hide();
	});

	$(".backToHomeIcon").on(clickEvent, function(){
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
	});

	$(".scopeButton").on(clickEvent, function(){
		if(stopSignVisible===true){
			hideStopSign();
		}
	});

	$("#gameiFrame").on(clickEvent, function(event){
		event.stopPropagation();
	});
	
}
// END home screen------------------------

// iScroll Functions-------------------------------

function initializeVerticaliScroll(pageIndex, snapTo){

	this.snapTo = snapTo;
	this.momentum = pageIndex==1?false:true;
	this.wrapperEl = "iScrollVerticalWrapper"+pageIndex;

	if(verticaliScrolls[pageIndex]){
		verticaliScrolls[pageIndex].destroy();
	}

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




// start of User-------------------------
var User = function(val){ //Game object
	this.id = val.id;
	this.email = val.email;
	this.username = val.username;
	this.month = val.month;
	this.date = val.date;
	this.year = val.year;
	this.gender = val.gender;
	this.PRO = val.PRO;
	this.gratii = val.gratii;
	this.newMessages = 0;
	this.gameInProgressID = 0;
	this.challengeIssueInProgress = false;
	this.challengeIssueInProgress = false;
	this.arcadeEvents = [];	
}

User.prototype.completeProfile = function(){
	$("#profile #email").val(this.email);
	$("#profile #username").val(this.username);
	$("#profile #month").val(this.month);
	$("#profile #date").val(this.date);
	$("#profile #year").val(this.year);
	$("#profile #gender").val(this.gender);
	$(".header .gratiiScore").html(this.gratii);
}

/*****************FOR GRATII ANIM TESTING ONLY:::REMOVE LATER!!**************/
$(".header .gratiiCoin").on(clickEvent, function(){
	user.changeGratii(7);
});	
/*****************FOR GRATII ANIM TESTING ONLY:::REMOVE LATER!!**************/

User.prototype.changeGratii = function(changeInGratii){
	if(changeInGratii>=0){
		var changeSymbol = "+";
		var changeColor = "green";
	}else{
		var changeSymbol = "";
		var changeColor = "red";
	}
	

	
	$(".header .gratiiScore").html(changeSymbol+changeInGratii);
	$(".header .gratiiScore").css({color:changeColor});
	$(".header .gratiiScore").animate({opacity:".2", fontSize:"60px"}, {
	    queue:    false,
	    duration: 1300,
	    complete: function() { 
	        var beforeGratii = parseInt(user.gratii);
			user.gratii = beforeGratii + changeInGratii;
			$(".header .gratiiScore").html(user.gratii);
			$(".header .gratiiScore").css({color:"black", fontSize:"24px", opacity:"1", zIndex:""});
	    }
	});
	
	


}


// end of User-------------------------


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

Game.prototype.challengeClick = function(event){
		
	event.stopPropagation();
	if(stopSignVisible===false){
		triggerChallengePanel(this.Game.id, this.Game.title);
	}	
}

Game.prototype.playGame = function(event){
	
	if(stopSignVisible===false){
		$(".mainApp").hide();
		$(".footer").hide();
		$("#gameiFrame").attr('src','games/'+this.Game.id+'/index.html?v=4');
		$("#gameiFrame").show();
		$(".gratiiLogo#header").css({backgroundImage:"url(images/backArrow.png)", width:"35px", height:"35px", backgroundSize:"35px 35px"});
		$(".gratiiLogo#header").click(function(){
			closeGameiFrame();
		});
		user.gameInProgressID = this.Game.id;
	}
                                
}

function closeGameiFrame(){
	$("#gameiFrame").attr('src','');
	$("#gameiFrame").hide();
	$(".mainApp").show();
	$(".footer").show();
	$(".gratiiLogo#header").css({backgroundImage:"url(images/gratiiColorShadow.png)", width:"99px", height:"30px", backgroundSize:"99px 30px"});
	
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
		this.challengeButton.style.opacity = user.PRO?1:.5;
		this.arcadeContent.appendChild(this.challengeButton);

		this.challengeButton.addEventListener('click', {
                                 handleEvent:this.challengeClick,                  
                                 Game:this}, false);
	}
	
	this.arcadeFrameA.addEventListener('click', {
                                 handleEvent:this.playGame,                  
                                 Game:this}, false);

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
		this.td.id = this.topTen[i].username;
		this.td.innerHTML = this.topTen[i].username+': '+this.topTen[i].score;
		this.row.appendChild(this.td);
		this.td.addEventListener('click', function(event){
			triggerUserInteractionPanel(this.id, this.id);
		});

		this.td = document.createElement('td');
		this.td.className = 'username';
		this.td.id = this.topTen[i+5].username;
		this.td.innerHTML = this.topTen[i+5].username+': '+this.topTen[i+5].score;
		this.row.appendChild(this.td);
		this.td.addEventListener('click', function(event){
			triggerUserInteractionPanel(this.id, this.id);
		});

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
	this.clickthrough = val.clickthrough;
	this.fbDiv = val.fbDiv;
	this.fb = val.fb;
	this.twitter = val.twitter;
	this.secondsUntilStart = val.secondsUntilStart;
	this.secondsRemaining = val.secondsRemaining;
	this.secondsLasted = val.secondsLasted;
	this.inputVisible = false;
	
	this.li = document.createElement('li');
	this.li.className = "mainLI vSnapToHere";
	this.li.id = "auctionSnapWrapper_"+this.id;
	this.li.style.height = $(window).width()*.5;
	
	auctionObjects.push(this);
}

function getAuctionObjectByID(id){
	var idRequested = id;
	for(var i=0; i<auctionObjects.length; i++){
		if(auctionObjects[i].id==idRequested){
			return i;
		}
	}
}

function updateLiveAuctionAfterBidFromNode(auctionID, leader, bid){
	var i = getAuctionObjectByID(auctionID);
	auctionObjects[i].bids++;
	var totalBids = ""+auctionObjects[i].bids+"";
	console.log(totalBids);
	if(totalBids.slice(-1) == "1" && totalBids.slice(-2) != "11" ){
		auctionObjects[i].bidCountGrammarText = "st";
	}else if(totalBids.slice(-1) == "2" && totalBids.slice(-2) != "12"){
		auctionObjects[i].bidCountGrammarText = "nd";
	}else if(totalBids.slice(-1) == "3" && totalBids.slice(-2) != "13"){
		auctionObjects[i].bidCountGrammarText = "rd";
	}else{
		auctionObjects[i].bidCountGrammarText = "th";
	}
	auctionObjects[i].currentBid = bid;
	auctionObjects[i].leader = leader;
	auctionObjects[i].secondsRemaining = secondsPerAuction;
	auctionObjects[i].leaderDiv.innerHTML = leader;
	auctionObjects[i].styleLiveAuctionStats(true);
}

Auction.prototype.styleLiveAuctionStats = function(viaNode){
	
	if(viaNode===true){
		console.log("fafffff");
    	$( ".auctionStatsContent" ).effect( "highlight", {color:"lightgreen"}, 800);
	}
	
	this.auctionStatsContent.innerHTML = "";
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
	this.leaderDiv.id = this.leader;
	if(this.bids > 0){
		this.leaderDiv.style.color = "black";
		this.leaderDiv.innerHTML = this.leader;
		this.leaderDiv.addEventListener(clickEvent, function(event){
			if(clickEvent!='click'){
				$(this).trigger('click');
			}
			event.stopPropagation();
			event.preventDefault();
			triggerUserInteractionPanel(this.innerHTML, this.id);
		});
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

	this.bidInfoDiv.addEventListener('click', {
                             handleEvent:this.showBidInputs,                  
                             Auction:this}, false);

	this.scrollerDiv.addEventListener(clickEvent, {
                             handleEvent:this.removeBidInputs,                  
                             Auction:this}, false);

	this.auctionStatsWrapperDiv.addEventListener(clickEvent, {
                             handleEvent:this.removeBidInputs,                  
                             Auction:this}, false);
	
}

Auction.prototype.placeBidClick = function(event){
	event.stopPropagation();
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

		that.leaderInfoDiv.style.display = "none";

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
		that.newBidButton.addEventListener('click', {
                             handleEvent:that.placeBidClick,                  
                             Auction:that}, false);
		that.newBidButton.addEventListener('touchstart', function(event){
			event.stopPropagation();
		});
		that.newBidButton.addEventListener('click', function(event){
			event.stopPropagation();
		});


	}
}

Auction.prototype.removeBidInputs = function(){

	that = this.Auction;

	if(that.inputVisible === true){

		that.leaderInfoDiv.style.display = "";

		that.newBidInput.style.display = "none";
		that.newBidButton.style.display = "none";
		that.currentBidDiv.style.display = "";
		that.auctionCoin.style.display = "";

		that.inputVisible = false;

	}

}

Auction.prototype.styleClickthrough = function(){

	var clickthroughHTML = "<a href='"+this.clickthrough+"' target='_blank'>Check them out online.</a>";
	return clickthroughHTML;
}

Auction.prototype.styleFB = function(){

	var likeBtn = '<div class="fb-like" data-href="'+this.fb+'" data-layout="button_count" data-action="like" data-show-faces="false" data-share="false"></div>';
	// FB.Event.subscribe('edge.create',
	// 	function(response) {
	// 		// alert('You liked the URL: ' + response);
	// 		app.Data.trackFacebookLike(auctionID);
	// 	}
	// );
	return likeBtn;
}

Auction.prototype.styleTwitter = function(){

	var followBtn = twttr.widgets.createFollowButton(this.twitter,
										this.twitterButtonDiv,
										function (el) {
											console.log("Follow button created."); //callback function
										},
										{size: 'medium', count: 'none'}
										);
	return followBtn;
}

Auction.prototype.styleLiveTimerDynamicProperties = function(){

	var widthPercentage = ((1-(this.secondsRemaining/secondsPerAuction))*100).toFixed(1);
	this.auctionTimerBlackout.style.width = widthPercentage+"%";

	if(this.secondsRemaining!=0){
		var timer = convertSecondsToTimer(this.secondsRemaining);
		this.auctionTimerBlackout.innerHTML = "&nbsp"+timer;
	}else{
		this.auctionTimerBlackout.innerHTML = "This auction has ended.";
		this.bidsDiv.innerHTML = "WINNER!";
		this.bidsDiv.style.fontWeight = "bold";
		this.bidsDiv.style.color = "red";
	}

}

Auction.prototype.styleUpnextTimerDynamicProperties = function(){

	if(this.secondsUntilStart!=0){
		var timer = convertSecondsToTimer(this.secondsUntilStart);
		this.upnextTimerDiv.innerHTML = "Starts in: "+timer;
	}else{
		this.upnextTimerDiv.innerHTML = "This auction is now Live!";
		this.upnextTimerDiv.style.fontWeight = "bold";
		this.upnextTimerDiv.style.color = "red";
	}

}

function convertSecondsToTimer(seconds){
	if(seconds<60){
		if(seconds<10){
			var timer = "0"+seconds;
		}else{
			var timer = seconds;
		}
		
		return timer;
	}else if(seconds<3600){
		var minutes = Math.floor(seconds/60);
		var remainingSeconds = seconds%(minutes*60);

		if(remainingSeconds<10){
			remainingSeconds = "0"+remainingSeconds;
		}
		
		var timer = minutes+":"+remainingSeconds; 
		
		return timer;
	}else if(seconds>=3600){
		var hours = Math.floor(seconds/3600);
		var remainingMinutes = Math.floor(seconds/60)%(hours*60);
		if(remainingMinutes<10){
			remainingMinutes = "0"+remainingMinutes;
		}
		var remainingSeconds = seconds%(hours*60*60+remainingMinutes*60);
		if(remainingSeconds<10){
			remainingSeconds = "0"+remainingSeconds;
		}

		var timer = hours+":"+remainingMinutes+":"+remainingSeconds; 

		return timer;
	}
}

var t=setInterval(updateAuctionTimers,1000);

function updateAuctionTimers(){

	$.each(auctionObjects, function(key, val){			
	 	if(this.secondsRemaining>0 && this.bids>0){
	 		this.secondsRemaining--;
	 	}
	 	if(currentPage===1 && currentAuctionScope===0){
	 		this.styleLiveTimerDynamicProperties();
	 	}
	 	if(this.secondsUntilStart>0){
	 		this.secondsUntilStart--;
	 	}
	 	if(currentPage===1 && currentAuctionScope===1){
	 		this.styleUpnextTimerDynamicProperties();
	 	}
	});
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

	this.auctionTimerContainer = document.createElement('div');
	this.auctionTimerContainer.className = "auctionTimerContainer";
	$("#auctions .auctions").append(this.auctionTimerContainer);

	this.auctionTimerWrapper = document.createElement('div');
	this.auctionTimerWrapper.className = "auctionTimerWrapper";
	this.auctionTimerContainer.appendChild(this.auctionTimerWrapper);

	this.auctionTimerImage = document.createElement('div');
	this.auctionTimerImage.className = "auctionTimerImage";
	this.auctionTimerWrapper.appendChild(this.auctionTimerImage);

	this.auctionTimerBlackout = document.createElement('div');
	this.auctionTimerBlackout.className = "auctionTimerBlackout";
	this.styleLiveTimerDynamicProperties();
	this.auctionTimerWrapper.appendChild(this.auctionTimerBlackout);

	this.auctionTitleContainerDiv = document.createElement('div');
	this.auctionTitleContainerDiv.className = "auctionTitleContainer";
	$("#auctions .auctions").append(this.auctionTitleContainerDiv);

	this.auctionTitleWrapperDiv = document.createElement('div');
	this.auctionTitleWrapperDiv.className = "auctionTitleWrapper";
	this.auctionTitleContainerDiv.appendChild(this.auctionTitleWrapperDiv);

	this.auctionClientDiv = document.createElement('div');
	this.auctionClientDiv.className = "auctionClientDiv";
	this.auctionClientDiv.innerHTML = this.client;
	this.auctionTitleWrapperDiv.appendChild(this.auctionClientDiv);

	this.auctionTitleDiv = document.createElement('div');
	this.auctionTitleDiv.className = "auctionTitleDiv";
	this.auctionTitleDiv.innerHTML = this.title;
	this.auctionTitleWrapperDiv.appendChild(this.auctionTitleDiv);

	this.auctionStatsWrapperDiv = document.createElement('div');
	this.auctionStatsWrapperDiv.className = "auctionStatsWrapper";
	$("#auctions .auctions").append(this.auctionStatsWrapperDiv);

	this.auctionStatsContent = document.createElement('div');
	this.auctionStatsContent.className = "auctionStatsContent";
	this.auctionStatsWrapperDiv.appendChild(this.auctionStatsContent);

	this.styleLiveAuctionStats();

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
	this.auctionFrameDivB.appendChild(this.auctionContent);

	if(this.clickthrough == "---" && this.fb == "---" && this.twitter == "---"){
		this.bonusTitleDiv = document.createElement('div');
		this.bonusTitleDiv.className = "bonusTitle";
		this.bonusTitleDiv.innerHTML = "Sorry, no bonus gratii available here. Check other auctions.";
		this.auctionContent.appendChild(this.bonusTitleDiv);
	}else{
		this.bonusTitleDiv = document.createElement('div');
		this.bonusTitleDiv.className = "bonusTitle";
		this.bonusTitleDiv.innerHTML = "Free bonus gratii from "+this.client+"!";
		this.auctionContent.appendChild(this.bonusTitleDiv);

		if(this.clickthrough != "---"){
			this.clickthroughATag = document.createElement('a');
			this.clickthroughATag.href = this.clickthrough;
			this.clickthroughATag.target = "_blank";
			this.auctionContent.appendChild(this.clickthroughATag); 

			this.clickthroughWrapperDiv = document.createElement('div');
			this.clickthroughWrapperDiv.className = "clickthroughWrapper";
			this.clickthroughWrapperDiv.innerHTML = "Check them out online";
			this.clickthroughATag.appendChild(this.clickthroughWrapperDiv); 
		}

		if(this.twitter != "---"){
			this.twitterWrapperDiv = document.createElement('div');
			this.twitterWrapperDiv.className = "twitterWrapper";
			this.auctionContent.appendChild(this.twitterWrapperDiv); 

			this.twitterTitleDiv = document.createElement('div');
			this.twitterTitleDiv.className = "twitterTitle";
			this.twitterTitleDiv.innerHTML = "Follow them on twitter";
			this.twitterWrapperDiv.appendChild(this.twitterTitleDiv);

			this.twitterButtonDiv = document.createElement('div');
			this.twitterButtonDiv.className = "twitterButton";
			this.styleTwitter();
			this.twitterWrapperDiv.appendChild(this.twitterButtonDiv);
		}

		if(this.fb != "---"){
			this.fbWrapperDiv = document.createElement('div');
			this.fbWrapperDiv.className = "fbWrapper";
			this.auctionContent.appendChild(this.fbWrapperDiv); 

			this.fbTitleDiv = document.createElement('div');
			this.fbTitleDiv.className = "fbTitle";
			this.fbTitleDiv.innerHTML = "Like them on Facebook";
			this.fbWrapperDiv.appendChild(this.fbTitleDiv);

			this.fbButtonDiv = document.createElement('div');
			this.fbButtonDiv.id = "fbButton";
			this.fbButtonDiv.className = "fbButton";
			this.fbButtonDiv.innerHTML = this.styleFB();
			this.fbWrapperDiv.appendChild(this.fbButtonDiv);
		}
	}

	this.indicatorUL = document.createElement('ul');
	this.indicatorUL.id = "indicator";
	this.li.appendChild(this.indicatorUL);

	this.activeLI = document.createElement('li');
	this.activeLI.className = "active";
	this.indicatorUL.appendChild(this.activeLI);

	this.inactiveLI = document.createElement('li');
	this.indicatorUL.appendChild(this.inactiveLI);

	this.auctionTimerContainer = document.createElement('div');
	this.auctionTimerContainer.className = "auctionTimerContainer";
	$("#auctions .auctions").append(this.auctionTimerContainer);

	this.auctionTimerWrapper = document.createElement('div');
	this.auctionTimerWrapper.className = "auctionTimerWrapper";
	this.auctionTimerContainer.appendChild(this.auctionTimerWrapper);

	this.upnextTimerDiv = document.createElement('div');
	this.upnextTimerDiv.className = "upnextTimer";
	this.styleUpnextTimerDynamicProperties();
	this.auctionTimerWrapper.appendChild(this.upnextTimerDiv);

	this.auctionTitleContainerDiv = document.createElement('div');
	this.auctionTitleContainerDiv.className = "auctionTitleContainer";
	$("#auctions .auctions").append(this.auctionTitleContainerDiv);

	this.auctionTitleWrapperDiv = document.createElement('div');
	this.auctionTitleWrapperDiv.className = "auctionTitleWrapper";
	this.auctionTitleContainerDiv.appendChild(this.auctionTitleWrapperDiv);

	this.auctionClientDiv = document.createElement('div');
	this.auctionClientDiv.className = "auctionClientDiv";
	this.auctionClientDiv.innerHTML = this.client;
	this.auctionTitleWrapperDiv.appendChild(this.auctionClientDiv);

	this.auctionTitleDiv = document.createElement('div');
	this.auctionTitleDiv.className = "auctionTitleDiv";
	this.auctionTitleDiv.innerHTML = this.title;
	this.auctionTitleWrapperDiv.appendChild(this.auctionTitleDiv);

	this.auctionStatsWrapperDiv = document.createElement('div');
	this.auctionStatsWrapperDiv.className = "auctionStatsWrapper";
	$("#auctions .auctions").append(this.auctionStatsWrapperDiv);

	this.auctionStatsContent = document.createElement('div');
	this.auctionStatsContent.className = "auctionStatsContent";
	this.auctionStatsWrapperDiv.appendChild(this.auctionStatsContent);

	this.bonusMessageDiv = document.createElement('div');
	this.bonusMessageDiv.className = "bonusMessage";
	this.bonusMessageDiv.innerHTML = "Psst.. check above for free bonus gratii from "+this.client+"!";
	this.auctionStatsContent.appendChild(this.bonusMessageDiv);



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

	this.auctionContentA = document.createElement('div');
	this.auctionContentA.className = "auctionContent";
	this.auctionContentA.style.backgroundImage = "url('"+this.image+"')";
	this.auctionFrameDivA.appendChild(this.auctionContentA);

	this.auctionFrameDivB = document.createElement('div');
	this.auctionFrameDivB.className = "auctionFrame";
	this.auctionFrameDivB.id = "b";
	this.scrollerDiv.appendChild(this.auctionFrameDivB);

	this.auctionContentB = document.createElement('div');
	this.auctionContentB.className = "auctionContent";
	this.auctionContentB.innerHTML = "--The Deets Go Here--";
	this.auctionFrameDivB.appendChild(this.auctionContentB);

	this.indicatorUL = document.createElement('ul');
	this.indicatorUL.id = "indicator";
	this.li.appendChild(this.indicatorUL);

	this.activeLI = document.createElement('li');
	this.activeLI.className = "active";
	this.indicatorUL.appendChild(this.activeLI);

	this.inactiveLI = document.createElement('li');
	this.indicatorUL.appendChild(this.inactiveLI);

	this.auctionTimerContainer = document.createElement('div');
	this.auctionTimerContainer.className = "auctionTimerContainer";
	$("#auctions .auctions").append(this.auctionTimerContainer);

	this.auctionTimerWrapper = document.createElement('div');
	this.auctionTimerWrapper.className = "auctionTimerWrapper";
	this.auctionTimerContainer.appendChild(this.auctionTimerWrapper);

	this.upnextTimerDiv = document.createElement('div');
	this.upnextTimerDiv.className = "upnextTimer";
	this.upnextTimerDiv.innerHTML = "Duration: "+convertSecondsToTimer(this.secondsLasted);
	this.auctionTimerWrapper.appendChild(this.upnextTimerDiv);

	this.auctionTitleContainerDiv = document.createElement('div');
	this.auctionTitleContainerDiv.className = "auctionTitleContainer";
	$("#auctions .auctions").append(this.auctionTitleContainerDiv);

	this.auctionTitleWrapperDiv = document.createElement('div');
	this.auctionTitleWrapperDiv.className = "auctionTitleWrapper";
	this.auctionTitleContainerDiv.appendChild(this.auctionTitleWrapperDiv);

	this.auctionClientDiv = document.createElement('div');
	this.auctionClientDiv.className = "auctionClientDiv";
	this.auctionClientDiv.innerHTML = this.client;
	this.auctionTitleWrapperDiv.appendChild(this.auctionClientDiv);

	this.auctionTitleDiv = document.createElement('div');
	this.auctionTitleDiv.className = "auctionTitleDiv";
	this.auctionTitleDiv.innerHTML = this.title;
	this.auctionTitleWrapperDiv.appendChild(this.auctionTitleDiv);

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
	this.bidsDiv.style.color = "red";
	this.bidsDiv.style.fontWeight = "bold";
	this.bidsDiv.innerHTML = "Winner ("+this.bids+this.bidCountGrammarText+" bid):";
	this.leaderInfoDiv.appendChild(this.bidsDiv);

	this.leaderDiv = document.createElement('div');
	this.leaderDiv.className = "leader";
	this.leaderDiv.id = this.leader;
	this.leaderDiv.style.color = "black";
	this.leaderDiv.innerHTML = this.leader;
	this.leaderDiv.addEventListener(clickEvent, function(event){
		if(clickEvent!='click'){
			$(this).trigger('click');
		}
		event.stopPropagation();
		event.preventDefault();
		triggerUserInteractionPanel(this.innerHTML, this.id);
	});
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
	this.gratii = val.gratii;

	this.li = document.createElement('li');
	this.li.className = "messageLI vSnapToHere";
	this.li.id = this.id;
	
	inboxObjects.push(this);

}

Message.prototype.openMessage = function(event)
{ 
	if(this.Message.opened===0){
		alert("Message open alert test: "+this.Message.title);
	    this.Message.div.style.backgroundImage = "url('images/boxingButton.png')";
	    user.newMessages--;
	    this.Message.opened = 1;
	    if(user.newMessages>0){
			$(".newMessageIndicator").html(user.newMessages);	
		}else{
			$(".newMessageIndicator").hide();
		}
		user.changeGratii(this.Message.gratii);
	}
}

Message.prototype.createUnopenedMessage = function(){
	
	$("#inbox .messages").append(this.li);

	this.div = document.createElement('div');
	this.div.className = "messageImage new";
	this.div.style.height = $(window).width()*.5;
	this.div.addEventListener('click', {
                                 handleEvent:this.openMessage,                  
                                 Message:this}, false);
	
	this.li.appendChild(this.div);

}

Message.prototype.createDomElements = function(){
	if(this.opened===0){
		user.newMessages++;
		this.createUnopenedMessage();
		
		if(user.newMessages>0){
			$(".newMessageIndicator").html(user.newMessages);
			$(".newMessageIndicator").show();
		}

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
		if(currentAuctionScope===1){
			FB.XFBML.parse(document.getElementById('auction'));
		}

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

$(".gratiiLogo").click(function(){
	FB.XFBML.parse(document.getElementById('auction'));
	//alert("hi");
});

function createObjects(dataRequested, data){

	console.log("Creating objects: "+dataRequested+"...");
	if(dataRequested==="session"){

		$.each(data, function(key, val){			
			if(val.session===true){
				console.log(val.session+" XXXXXXXXXXXXXXXX");
				getData("profile");
			}else{
				val = {
					"id": "0", 
					"email": "demo@gratii.com",
					"username":"demo",
					"month":"6",
					"date":"17",
					"year":"1988",
					"gender":"m",
					"gratii":"0",
					"PRO":0
				};
				user = new User(val);
			}
		});
		user.completeProfile();
		
	
	}else if(dataRequested==="profile"){

		$.each(data, function(key, val){			
			user = new User(val);
		});
		user.completeProfile();

	}else if(dataRequested==="arcade"){
	
		$.each(data, function(key, val){			
			new Game(val);
		});
		
		createDomElementsFromObjects(dataRequested);
	
	}else if(dataRequested==="auctions"){
		
		$.each(data, function(key, val){			
			new Auction(val);
		});
		
		createDomElementsFromObjects(dataRequested);
	
	}else if(dataRequested==="inbox"){
	
		$.each(data, function(key, val){			
			new Message(val);
		});
		
		createDomElementsFromObjects(dataRequested);
	
	}else if(dataRequested==="transactions"){
	
		$.each(data, function(key, val){			
			new Transaction(val);
		});
		createDomElementsFromObjects(dataRequested);
	
	}

}

function getData(dataRequested){
	console.log("Getting data: "+dataRequested+"...");

	if(dataRequested==="session"){

		$.ajax({
	        url: 'js/session.json',
	        type: 'GET',
	        async: false,
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

	}else if(dataRequested==="profile"){

		$.ajax({
	        url: 'js/profile.json',
	        type: 'GET',
	        async: false,
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

	}else if(dataRequested==="arcade"){

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
		}else if(currentAuctionScope===2){
			URL = 'js/pastAuctions.json';
		}

		auctionObjects = [];
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
		
		transactionObjects = [];
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

	if(stopSignVisible===true){
		hideStopSign();
	}

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
		$(".send").hide();
		$(".messages").show();
		verticaliScrolls[2].refresh();
	}else{
		$(".messages").hide();
		$(".send").show();
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
		$("#dimmer").fadeIn();
		$(".stopSignWrapper").animate({bottom:"51px"}, 500);
		stopSignVisible = true;
	});
	
	
}

function hideStopSign(){
	$(".stopSignWrapper").animate({bottom:"-300px"}, 500, function(){
		$("#dimmer").fadeOut();
		$(".stopSignWrapper").html('');
		$(".stopSignWrapper").hide();
		stopSignVisible = false;
	});
	
}

function triggerUserInteractionPanel(userID, username){

	var thisUserID = userID;
	var thisUsername = username; 

	$(".stopSignWrapper").html('');

	var stopSignTitle = document.createElement('div');
	stopSignTitle.className = "stopSignTitle";
	stopSignTitle.innerHTML = "Interact with "+thisUsername+"</br></br>";
	$(".stopSignWrapper").append(stopSignTitle);

	var sendMessageButton = document.createElement('div');
	sendMessageButton.className = ('formButton');
	sendMessageButton.innerHTML = 'Send a message';
	sendMessageButton.addEventListener('click', function(event){
		event.stopPropagation();
		hideStopSign();
		changePage(2);
		changeInboxScope(1);
		$("#inbox .formInputText#username").val(thisUsername);
	});
	$(".stopSignWrapper").append(sendMessageButton);

	var challengeButton = document.createElement('div');
	challengeButton.className = ('formButton');
	challengeButton.innerHTML = 'Issue a challenge';
	challengeButton.addEventListener('click', function(event){
		event.stopPropagation();
		hideStopSign();
		changePage(0);
		triggerChallengePanel(null, null, thisUsername);
	});
	$(".stopSignWrapper").append(challengeButton);
	console.log('called!');
	showStopSign();
}

function triggerErrorMessage(type, text){
	var errorType = type;
	
	if(stopSignVisible===true){
		$(".stopSignWrapper").html('');
	}

	if(errorType == "default"){

		var stopSignTitle = document.createElement('div');
		stopSignTitle.className = "stopSignTitle";
		stopSignTitle.innerHTML = "Error</br></br>";
		$(".stopSignWrapper").append(stopSignTitle);

		var errorText = text || "Uh oh! Something went wrong.. try again.";
		
		var stopSignErrorMessage = document.createElement('div');
		stopSignErrorMessage.className = "stopSignErrorMessage";
		stopSignErrorMessage.innerHTML = errorText;
		$(".stopSignWrapper").append(stopSignErrorMessage);
	}else if(errorType == "notLoggedIn"){
		var stopSignTitle = document.createElement('div');
		stopSignTitle.className = "stopSignTitle";
		stopSignTitle.innerHTML = "Please log in</br></br>";
		$(".stopSignWrapper").append(stopSignTitle);

		var errorText = text || "Woah there, that's for Gratii members only! You need to be signed in to do that.</br></br>";
		
		var stopSignErrorMessage = document.createElement('div');
		stopSignErrorMessage.className = "stopSignErrorMessage";
		stopSignErrorMessage.innerHTML = errorText;
		$(".stopSignWrapper").append(stopSignErrorMessage);

		var backToHomeButton = document.createElement('div');
		backToHomeButton.className = ('formButton');
		backToHomeButton.innerHTML = 'Login/Sign up';
		backToHomeButton.addEventListener(clickEvent, function(event){
			event.stopPropagation();
			hideStopSign();
			$(".homeScreen").show();
		});
		$(".stopSignWrapper").append(backToHomeButton);
	}
		
	showStopSign();	
	
}

function triggerChallengePanel(gameID, gameTitle, challengeeUsername){
	
	var thisGameID = gameID;
	var thisGameTitle = gameTitle;
	var thisChallengee = challengeeUsername;

	if(stopSignVisible===true){
		setTimeout(function(){triggerChallengePanel(thisGameID, thisGameTitle, thisChallengee);}, 100);
		return;
	}

	var stopSignTitle = document.createElement('div');
	stopSignTitle.className = "stopSignTitle";
	stopSignTitle.innerHTML = "Create a Challenge";
	$(".stopSignWrapper").append(stopSignTitle);

	var stopSignSubTitle = document.createElement('div');
	stopSignSubTitle.className = "stopSignSubTitle";
	stopSignSubTitle.innerHTML = "<b>Rules:</b> Enter your oppenent's name.</br>Enter how much gratii you want to wager.</br>Try to get the highest score you can.</br>No do-overs. Winner takes all!";
	$(".stopSignWrapper").append(stopSignSubTitle);

	var formWrapper = document.createElement('div');
	formWrapper.className = ('formWrapper');
	$(".stopSignWrapper").append(formWrapper);

	var formInputText1 = document.createElement('input');
	formInputText1.type = ('text');
	formInputText1.placeholder = ('Opponent\'s username');
	formInputText1.className = ('formInputText top');
	formInputText1.id = ('challengee');
	if(thisChallengee){
		formInputText1.value = thisChallengee;
	}
	formInputText1.addEventListener(clickEvent, function(event){
		event.stopPropagation();
	});
	formWrapper.appendChild(formInputText1);

	var formInputText2 = document.createElement('input');
	formInputText2.type = ('number');
	formInputText2.placeholder = ('Enter your wager');
	formInputText2.className = ('formInputText bottom');
	formInputText2.id = ('wager');
	formInputText2.addEventListener(clickEvent, function(event){
		event.stopPropagation();
	});
	formWrapper.appendChild(formInputText2);

	var formInputSelect = document.createElement('select');
	formInputSelect.className = "challengeSelect";
	formWrapper.appendChild(formInputSelect);

	var selectOption = document.createElement('option');
	selectOption.value = '0';
	selectOption.innerHTML = "Select";
	formInputSelect.appendChild(selectOption);

	for(var i=0; i<gameObjects.length; i++){

		if(gameObjects[i].challengeable == "1"){
			var selectOption = document.createElement('option');
			selectOption.value = gameObjects[i].id;
			selectOption.innerHTML = gameObjects[i].title;
			if(gameObjects[i].id == thisGameID){
				selectOption.setAttribute("selected", "selected");
			}
			formInputSelect.appendChild(selectOption);
		}
	}

	var formButton = document.createElement('div');
	formButton.className = ('formButton');
	formButton.id = ('submitChallenge');
	formButton.innerHTML = 'Start the challenge!';
	formButton.addEventListener(clickEvent, function(event){
		event.stopPropagation();
	});
	formWrapper.appendChild(formButton);

	showStopSign();	
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

