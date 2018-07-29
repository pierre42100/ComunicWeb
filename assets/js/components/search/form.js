/**
 * Search form component
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.search.form = {

	/**
	 * Store the text input area
	 */
	_textInput: null,

	/**
	 * Initializate a search form element
	 * 
	 * @param {HTMLElement} textInput The text input node
	 * @param {HTMLElement} searchResultBox The target of the results
	 * @return {Boolean} True for a success
	 */
	init: function(textInput, searchResultBox){
		//Log action
		ComunicWeb.debug.logMessage("Initializate search menu");

		//Create header
		var searchHeader = createElem("li", searchResultBox);
		searchHeader.className = "header";
		searchHeader.innerHTML = "Search results";

		//Box core
		var searchBoxCore = createElem("li", searchResultBox);
		var searchBoxContainer = createElem("div", searchBoxCore);
		searchBoxContainer.className = "searchBoxResultsContainer";
		
		//Create footer
		var searchFooter = createElem("li", searchResultBox);
		searchFooter.className = "footer";

		//Footer link
		var footerLink = createElem("a", searchFooter);
		footerLink.innerHTML = "See more results";
		footerLink.onclick = function(){
			openPage("search?q=" + this.getAttribute("data-searchValue"));
		}

		//Make input text lives
		textInput.onkeyup = function(){
			ComunicWeb.components.search.form.ontextchange(textInput, searchResultBox, searchBoxContainer, footerLink);
		}

		//Cache textinput area
		this._textInput = textInput;

		return true;
	},

	/**
	 * What to do on text change
	 * 
	 * @param {HTMLElement} textInput The text input node
	 * @param {HTMLElement} searchResultBox The main search box
	 * @param {HTMLElement} searchBoxContainer The target of the results
	 * @param {HTMLElement} footerLink The footer element
	 * @return {Boolean} True for a success
	 */
	ontextchange: function(textInput, searchResultBox, searchBoxContainer, footerLink){
		//We check if the text was removed
		if(textInput.value == ""){
			//Text was removed
			//Hide box
			searchResultBox.style.display = "none";
			return true;
		}

		//We show the box
		searchResultBox.style.display = "block";

		//Change "see more result" value
		footerLink.setAttribute("data-searchValue", textInput.value);

		//Perform a request on the server
		apiURI = "search/user";
		params = {
			query: textInput.value,
		};
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, function(response){
			
			//Continue only in case of success
			if(response.error)
				return false;
			
			//Preload users informations
			ComunicWeb.user.userInfos.getMultipleUsersInfos(response, function(usersInfos){

				//Remove any remainging element in searchResultBox
				emptyElem(searchBoxContainer);

				//Create menu list
				var menuList = createElem("ul", searchBoxContainer);
				menuList.className = "menu";

				//Process each result
				for(i in response){

					//Retrieve userID
					var userID = response[i];
					
					//We show user only if we have informations about him
					if(usersInfos["user-"+userID])
						//Display user informations
						ComunicWeb.components.search.form.displayUser(usersInfos["user-"+userID], menuList);

				}

				//Enable slimscroll
				$(menuList).slimScroll({
					height: '100%'
				});
			});
		});
		
	},

	/**
	 * Display a user on the result list
	 * 
	 * @param {Integer} userInfos Informations about the user
	 * @param {HTMLElement} menuList The target list menu
	 * @return {Boolean} True for a success
	 */
	displayUser: function(userInfos, menuList){
		//Create user element
		var userListElement = createElem("li", menuList);
		var userLinkElement = createElem("a", userListElement);
		
		//User account image
		var userAccountImageContainer = createElem("div", userLinkElement);
		userAccountImageContainer.className = "pull-left";

		var userImage = createElem("img", userAccountImageContainer);
		userImage.className = "img-circle";
		userImage.alt = "User image";
		userImage.src = path_assets("img/defaultAvatar.png");

		//User name
		var usernameElem = createElem("h4", userLinkElement);
		usernameElem.innerHTML = "Loading...";
			
		//Apply user informations
		userImage.src = userInfos.accountImage;
		usernameElem.innerHTML = userInfos.firstName + " " + userInfos.lastName;

		//Make user link element live
		userLinkElement.onclick = function() {
			ComunicWeb.components.search.form.close();
			openUserPage(userInfos);
		}
	},

	/**
	 * Close and clear the search form
	 */
	close: function(){
		this._textInput.value = "";
		this._textInput.onkeyup();
	}
}