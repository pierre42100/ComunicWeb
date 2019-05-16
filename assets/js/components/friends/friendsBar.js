/**
 * Friends bar
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.friends.bar = {

	/**
	 * Display friends list
	 * 
	 * @return {Boolean} True for a success
	 */
	display: function(){
		//Log action
		ComunicWeb.debug.logMessage("Initialize friends list.");

		//Check if friends list already exists or not
		var friendsListContainer = byId("friendsList");

		//We check if the friend list already exists or not
		if(friendsListContainer){
			ComunicWeb.debug.logMessage("Notice: friend list already present on the page. Nothing to be done.");
			return true;
		}

		//Create and apply friends list element
		var friendsListContainer = createElem("div");
		friendsListContainer.id = "friendsList";
		
		//Check if "pageTarget" already exists or not
		var pageTarget = byId("pageTarget");
		if(pageTarget){
			//Insert friends list just before pageTarget
			byId("wrapper").insertBefore(friendsListContainer, pageTarget);
		}
		else{
			byId("wrapper").appendChild(friendsListContainer); //Just happend the menubar
		}

		//Initializate friends list
		this.init(friendsListContainer);

		//Success
		return true;
	},

	/**
	 * Initializate a friend list
	 * 
	 * @param {HTMLElement} friendsListContainer The container of the friend list
	 * @return {Boolean} True for a success
	 */
	init: function(friendsListContainer){

		//First, create the table container
		var listFriendsElem = createElem2({
			appendTo: friendsListContainer,
			type: "ul",
			class: "menu"
		});

		//Refresh friends list
		this.refresh(listFriendsElem);

		//Remove previously existing interval
		if(this.refreshInterval){
			clearInterval(this.refreshInterval);
		}

		//Make the friend bar automaticaly refreshed
		this.refreshInterval = setInterval(function(){
			if(byId("friendsList"))
				ComunicWeb.components.friends.bar.refresh(listFriendsElem);
		}, 15000);

		//Success
		return true;
	},

	/**
	 * Refresh the friendbar
	 * 
	 * @param {HTMLElement} listFriendsElem The element that contains the list of friens
	 * @return {Boolean} True for a success
	 */
	refresh: function(listFriendsElem){
		//Refresh it
		ComunicWeb.components.friends.list.refresh(function(friendsList){
			//Check for error
			if(!friendsList){
				//Log information
				ComunicWeb.debug.logMessage("ERROR : Can't refresh menubar without the latest list !");

				//Error
				return false;
			}

			//Get users list to get information about them
			usersID = {};
			for(i in friendsList){
				//Extract user id
				var processID = friendsList[i].ID_friend;

				usersID["user_"+processID] = processID;
			}
			
			//Get users ID informations
			ComunicWeb.user.userInfos.getMultipleUsersInfo(usersID, function(usersInfos){
				
				//Clean the area
				listFriendsElem.innerHTML = "";

				//Show each friend
				for(i in friendsList){
					//Show informations about the friend
					ComunicWeb.components.friends.bar.showFriendInfos(usersInfos["user-"+friendsList[i].ID_friend], friendsList[i], listFriendsElem);
				}

				//Check if the friends hasn't any friend
				if(friendsList.length == 0){
					//Display adapted message
					var noFriendMessageRow = createElem("li", listFriendsElem);
					var noFriendMessage = createElem("span", noFriendMessageRow);
					noFriendMessage.style.color = "#3c8dbc";
					noFriendMessage.style.fontSize = "150%";
					noFriendMessage.style.textAlign = "justify";
					noFriendMessage.innerHTML = lang("friends_bar_no_friends_notice")
				}

				//Enable slimscroll
				$(listFriendsElem.parentNode).slimScroll({
					height: '100%;'
				});
			});
		});
	},

	/**
	 * Show a friend informations
	 * 
	 * @param {Object} userInfos Informations about the user
	 * @param {Object} friendshipInfos Informations about the friendship
	 * @param {HTMLElement} listFriendsElem The target for the friends list
	 * @return {Boolean} True for a success
	 */
	showFriendInfos: function(userInfos, friendshipInfos, listFriendsElem){
		//Extract friend ID
		var friendID = friendshipInfos.ID_friend;

		//Create a row
		var friendRow = createElem("li", listFriendsElem);

		//Create link
		var friendLink = createElem2({
			appendTo: friendRow,
			type: "a"
		});

		//Make the link lives
		friendLink.onclick = function(){
			openUserPage(userInfos);

			//For the responsive mode
			ComunicWeb.components.friends.bar.toggleShowHide();
		}

		//Add user account image
		var imageRow = createElem2({
			appendTo: friendLink,
			type: "div",
			class: "pull-left"
		});
		var imageElem = createElem2({
			appendTo: imageRow,
			type: "img",
			class: "account-image",
			src: userInfos.accountImage
		});

		//Add user name
		var nameRow = createElem2({
			appendTo: friendLink,
			type: "h4",
			innerHTML: userInfos.firstName + " " + userInfos.lastName
		});

		//Add user login status
		var statusRow = createElem2({
			appendTo: friendLink,
			type: "p",
		});			

		//Check if the user was accepted or not
		if(friendshipInfos.accepted == "1"){

			//Check if user is online or not
			var currentTime = ComunicWeb.common.date.time();
			var timeDifference = currentTime - friendshipInfos.time_last_activity;

			if(timeDifference < 30){
				//User is logged in
				var iconsStats = createElem("i", statusRow);
				iconsStats.className = "fa fa-fw fa-circle";
				iconsStats.style.color = "green";
			}
			else {
				//User isn't logged in
				var logoutTime = createElem("small", statusRow);
				logoutTime.innerHTML = ComunicWeb.common.date.diffToStr(timeDifference);
			}
		}
		else {
			//We offer user to accept invitation
			var acceptButton = createElem("button", statusRow);
			acceptButton.className = "btn btn-xs btn-success";
			acceptButton.innerHTML = "<i class='fa fa-check'></i>";
			acceptButton.onclick = function(){
				ComunicWeb.components.friends.bar.processFriendShipRequest(friendID, true, statusRow)
			};

			//Insert space
			var space = createElem("span", statusRow);
			space.innerHTML = "&nbsp";

			//But he can also refuse it
			var refuseButton = createElem("button", statusRow);
			refuseButton.className = "btn btn-xs btn-danger";
			refuseButton.innerHTML = "<i class='fa fa-times'></i>";
			refuseButton.onclick = function(){
				ComunicWeb.components.friends.bar.processFriendShipRequest(friendID, false, statusRow)
			};
		}

		//Sucess
		return true;
	},

	/**
	 * Toogle show / hide friends bar
	 * 
	 * @return {Boolean} True for a success
	 */
	toggleShowHide: function(){
		//Get friends list element
		var friendListElem = byId("friendsList");

		//Log action
		ComunicWeb.debug.logMessage("Toggle friends list");

		//Check current bar state
		if(friendListElem.className == ""){
			//Show the bar
			friendListElem.className = "visible-bar";
		}
		else
			//Hide the bar
			friendListElem.className = "";

		//Success
		return true;
	},

	/**
	 * Accept / Deny a friendship request
	 * 
	 * @param {Integer} friendID The ID of the friend to accept / rejet
	 * @param {Boolean} accepted True if friendship is accepted, false else
	 * @param {HTMLElement} statusRow The parent node of friendship area
	 * @return {Boolean} True for a success
	 */
	processFriendShipRequest: function(friendID, accepted, statusRow){

		//Log action
		ComunicWeb.debug.logMessage("Process friendship request "+friendID);

		//Change statusRow style
		if(accepted)
			statusRow.innerHTML = lang("friends_bar_accepted");
		else
			statusRow.innerHTML = lang("friends_bar_rejected");
		
		//Perform an API request
		ComunicWeb.components.friends.list.respondRequest(friendID, accepted);

	},


}