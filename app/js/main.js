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
  	$(".mainLI").css({"height":($(window).width()*.5)});
  	$(".arcadeLI").css({"height":($(window).width()*.5)});
  	$(".messageImage").css({"height":($(window).width()*.5)});
});

$(document).ready(function(){

	getAndDrawArcade();
	//getAndDrawAuctions();
	getData("auctions");
	getData("inbox");

	
	initializeVerticaliScroll(3, false);

});

// iScroll Functions-------------------------------
function pullDownArcade () {
	getAndDrawArcade();
}

function pullDownAuctions () {
	getAndDrawAuctions();
}

function pullDownInbox () {
	console.log("pullDownInbox...");
}

function pullDownProfile () {
	console.log("pullDownProfile...");
}

function pullDown(){
	console.log(currentPage);
	getAndDrawArcade();
	verticaliScrolls[currentPage].refresh();
}

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
	glovesBackground = this.challengeable?"url('../app/images/boxingGloves1.png')":"none";
	this.html = 
	'<li id="gameSnapWrapper_'+escape(this.id)+'" class="mainLI vSnapToHere" style="height:'+$(window).width()*.5+';">'+
		'<div id="scroller">'+
			'<div class="arcadeFrame" id="a">'+
				'<div class="arcadeContent" style="background-image:url('+escape(this.image)+');">'+
					'<div class="challengeable_'+escape(this.challengeable)+'" style="opacity:'+escape((Userpro?1:.5))+';">'+
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
	$("#arcade .pageListWrapper").append('<ul class="pageUL" style="overflow:visible;">');

	console.log("Appending HTML for each Game object...");
	for(i=0;i<gameObjects.length;i++){
		console.log("Appending HTML for "+gameObjects[i].title+"...");
		$("#arcade .pageUL").append(gameObjects[i].html);
		initializeHorizontaliScroll('gameSnapWrapper_'+gameObjects[i].id);
		console.log("HTML for "+gameObjects[i].title+" appended#");
	}
	console.log("HTML for all Game objects appended#");

	$("#arcade .pageListWrapper").append('</ul>');
	console.log("#arcade UL closed#");
	initializeVerticaliScroll(0, ".vSnapToHere");
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
	$('#arcade .pageUL').remove();
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
	
	this.li = document.createElement('li');
	this.li.className = "mainLI vSnapToHere";
	this.li.id = "auctionSnapWrapper_"+this.id;
	this.li.style.height = $(window).width()*.5;
	
	auctionObjects.push(this);
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
// End of Auction Object & Drawing Functions-------------------------





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



// start of UNIVERSAL DATA-------------------------
function createDomElementsFromObjects(dataRequested){
	console.log("Request to create DOM elements from Objects received: "+dataRequested+"...");
	
	if(dataRequested==="auctions"){
		
		for(i=0;i<auctionObjects.length;i++){
			auctionObjects[i].createDomElements();
		}
		initializeVerticaliScroll(1, ".vSnapToHere");

	}else if(dataRequested==="inbox"){
		
		for(i=0;i<inboxObjects.length;i++){
			inboxObjects[i].createDomElements();
		}
		initializeVerticaliScroll(2, ".vSnapToHere");

	}	
}

function createObjects(dataRequested, data){

	console.log("Creating objects: "+dataRequested+"...");
	if(dataRequested==="auctions"){
		
		$.each(data, function(key, val){			
			new Auction(val);
		});
		createDomElementsFromObjects(dataRequested)
	
	}else if(dataRequested==="inbox"){
	
		$.each(data, function(key, val){			
			new Message(val);
		});
		createDomElementsFromObjects(dataRequested)
	
	}

}

function getData(dataRequested){
	console.log("Getting data: "+dataRequested+"...");

	if(dataRequested==="auctions"){

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

	} 
}
// end of UNIVERSAL DATA-------------------------







// Transaction Object & Drawing Functions---------------------
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
	transactionObjects.push(this);
}

Transaction.prototype.createTransactionHTML = function(){ 
	this.html = 
	'<li class="transactionLI" style="background-color:'+this.backgroundColor+';">'+
		'<div class="transactionID">id:'+this.id+
		'</div>'+
		'<div class="transactionTimestamp">'+this.timestamp+
		'</div>'+
		'<div class="transactionDescription" style="float:left;">'+this.description+': <font style="color:'+this.deltaColor+';">'+this.gratiiChange+''+'</font>'+
		'</div>'+
		'<div class="transactionCoin">'+
		'</div>'+
		'<div class="transactionBalance">'+this.balance+
		'</div>'+
	'</li>';
}

function drawTransactionList(){
	console.log("Drawing transaction list to the DOM...");

	console.log("Appending #transactions UL opener...");
	$("#profile .transactions").append('<ul class="pageUL" style="overflow:visible;">');
	console.log("Appending HTML for each Transaction object...");
	for(i=0;i<transactionObjects.length;i++){
		console.log("Appending HTML for "+transactionObjects[i].id+"...");
		$("#profile .pageUL").append(transactionObjects[i].html);
		console.log("HTML for "+transactionObjects[i].id+" appended#");
	}
	console.log("HTML for all Transaction objects appended#");
	$("#profile .transactions").append('</ul>');
	console.log("#profile UL closed#");
	initializeVerticaliScroll(3, false);
	console.log("iScroll initialized#");
	console.log("Transaction list appended to page and ready#");
}

function createEachTransactionHTML(){
	console.log("Creating the HTML for each Transaction object...");
	for(i=0;i<transactionObjects.length;i++){
		console.log("Creating the HTML for "+transactionObjects[i].id+"...");
		
		transactionObjects[i].createTransactionHTML();
		
		console.log("HTML for "+transactionObjects[i].id+" created#");
	}
	console.log("HTML for all Transaction objects created#");

	drawTransactionList();
}

function createTransactionObjects(data){

	console.log("Creating Transaction objects...");
	$.each(data, function(key, val){
		console.log("Creating Transaction object for "+val.id+"...");
		new Transaction(val);
		console.log("Transaction object for "+val.id+" created#");
	});
	console.log("All Transaction objects created#");

	if(drawTransactionsRequested===true){
		createEachTransactionHTML();
	}else{
		console.log("Not drawing transaction list#");
		return;
	}

}

function getTransactionData(){
	console.log("Getting transaction data...");

	$.ajax({
        url: 'js/transactions.json',
        type: 'GET',
        async: true,
        cache: false,
        timeout: 30000,
        error: function(){
        	console.log("Error getting transaction data#");
            return true;
        },
        success: function(data){ 
            console.log("Transaction data gotten#")
            createTransactionObjects(data);
        }
    });
}

function getAndDrawTransactions(){
	console.log("Preparing to get and draw transactions...");
	drawTransactionsRequested = true;
	$('#profile .pageUL').remove();
	transactionObjects = [];
	getTransactionData();
}
// End of Transaction Object & Drawing Functions---------------------






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
		getAndDrawTransactions();
		$(".transactions").toggle();
	}
	console.log("On profile scope "+selectedProfileScope+"#");
}

function changeProfileScope(selectedProfileScope){
	dimAllProfileScopes();
	highlightSelectedProfileScope(selectedProfileScope);
	getProfileScope(selectedProfileScope);
	//getAndDrawProfile();
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


function inputFocus(){
	//alert("test hide");
	$("body").css({'min-heilkght':'500px'});
}
function inputBlur(){
	// $(".header").css({'position':'fixed'});
}

// End of Input Checkers--------------------

