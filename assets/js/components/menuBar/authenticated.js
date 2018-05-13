/**
 * Menubar for authenticated users complements
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.menuBar.authenticated = {
	/**
	 * Add authenticated user specific elements
	 * 
	 * @param {HTMLElement} container The container element of the Menubar
	 */
	addElements: function(container){
		//Create an auto-collapsed element
		var navbarCollapse = createElem("div", container);
		navbarCollapse.id = "navbar-collapse";
		navbarCollapse.className = "navbar-collapse pull-left collapse";

		//Create navbar elements list
		var navbarCollapseElemList = createElem("ul", navbarCollapse);
		navbarCollapseElemList.className = "nav navbar-nav";

		//Add search form
		this.addSearchForm(navbarCollapseElemList);

		//Navbar right elements
		var navbarRight = createElem("div", container);
		navbarRight.className = "navbar-custom-menu";
		var navbarRightElemList = createElem("ul", navbarRight);
		navbarRightElemList.className = "nav navbar-nav";

		//Add user name
		this.addUserName(navbarRightElemList);

		//Add friends list button
		this.addFriendListButton(navbarRightElemList);

		//Add notifications dropdown
		ComunicWeb.components.notifications.dropdown.display(navbarRightElemList);

		//Add dropdown menu
		this.addDropdown(navbarRightElemList);
		
	},

	/**
	 * Add dropdown menu
	 * 
	 * @param {HTMLElement} navbarElem The target navbarlist element 
	 * @return {HTMLElement} The dropdown content element
	 */
	addDropdown: function(navbarElem){
		//Create dropdown menu
		var dropdown = createElem("li", navbarElem);
		dropdown.className = "dropdown dropdown-user-menu-action";

		//Add dropdown button
		var dropdownButton = createElem("a", dropdown);
		dropdownButton.className = "dropdown-toggle";
		dropdownButton.setAttribute("data-toggle", "dropdown");
		
		//Add dropdown button icon
		var dropdownButtonIcon = createElem("i", dropdownButton);
		dropdownButtonIcon.className = "fa fa-gear";

		//Add space
		dropdownButton.innerHTML += " ";

		//Add dropdown button arrow
		var dropdownButtonArrow = createElem("span", dropdownButton);
		dropdownButtonArrow.className = "caret";

		//Create dropdown menu content
		var dropdownContent = createElem("ul", dropdown);
		dropdownContent.className = "dropdown-menu"
		dropdownContent.setAttribute("role", "menu");


		//Add conversations link
		// var conversationsButton = createElem2({
		// 	appendTo: dropdownContent,
		// 	type: "li"
		// });
		// var conversationsLink = createElem2({
		// 	appendTo: conversationsButton,
		// 	type: "a",
		// 	innerHTML: "Conversations"
		// });
		// conversationsButton.onclick = function(){
		// 	openPage("conversations");
		// };

		//Add settings link
		var settingsButton = createElem2({
			appendTo: dropdownContent,
			type: "li"
		});
		var settingsLink = createElem2({
			appendTo: settingsButton,
			type: "a",
			innerHTML: "Settings"
		});
		settingsButton.onclick = function(){
			openPage("settings");
		};

		//Add logout link
		var logoutButton = createElem("li", dropdownContent);
		var logoutButtonLink = createElem("a", logoutButton);
		logoutButtonLink.innerHTML = lang("_menu_bar_action_logout");
		logoutButton.onclick = function(){openPage("logout")};

		//Return dropdown content element
		return dropdownContent;
	},

	/**
	 * Add friendsList toggle button
	 * 
	 * @param {HTMLElement} navbarElem The target navbarlist element 
	 * @return {HTMLElement} The button element
	 */
	addFriendListButton: function(navbarElem){
		//Create button
		var friendButton = createElem("li", navbarElem);
		friendButton.className = "friendToggleButton";

		//Create link
		var friendButtonLink = createElem("a", friendButton);
		var friendIcon = createElem("i", friendButtonLink);
		friendIcon.className = "fa fa-users";

		//Makes link live
		friendButtonLink.onclick = function(){
			ComunicWeb.components.friends.bar.toggleShowHide();
		};

		return friendButtonLink;
	},

	/**
	 * Add user name element
	 * 
	 * @param {HTMLElement} navbarElem The target navbarlist element 
	 * @return {HTMLElement} The user element
	 */
	addUserName: function(navbarElem){
		//Create user element
		var userelement = createElem("li", navbarElem);
		userelement.className = "user-menu";

		//Add user link element
		var userlinkelement = createElem("a", userelement);

		//Add user image
		var userimage = createElem("img", userlinkelement);
		userimage.className = "user-image";
		userimage.src = ComunicWeb.__config.assetsURL + "img/defaultAvatar.png";

		//Add user name
		var userNameElem = createElem("span", userlinkelement);
		userNameElem.className = "hidden-xs";
		userNameElem.innerHTML = lang("_loading");

		//Make a request to get informations about the user
		ComunicWeb.user.userInfos.getUserInfos("current", (function(userInfos){

			//Change user name
			userNameElem.innerHTML = userInfos.firstName + " "+ userInfos.lastName;

			//Change avatar url
			userimage.src = userInfos.accountImage;

			userlinkelement.onclick = function(){
				openUserPage(userIDorPath(userInfos));
			}

		}), true);
	},

	/**
	 * Add search form element
	 * 
	 * @param {HTMLElement} navbarElem The target navbarlist element 
	 * @return {HTMLElement} The user element
	 */
	addSearchForm: function(navbarElem){
		//Create form element
		var searchForm = createElem("li", navbarElem);
		searchForm.className = "dropdown navbar-form navbar-left messages-menu";
		searchForm.setAttribute("role", "search");

		//Create form group
		var formGroup = createElem("div", searchForm);
		formGroup.className = "form-group";

		//Create search input
		var searchInput = createElem("input", formGroup);
		searchInput.className = "form-control";
		searchInput.placeholder = lang("_menu_bar_search_placeholder");
		searchInput.type = "text";
		searchInput.id = "navbar-search-input";

		//Create dropdown container
		var dropdownContainer = createElem("ul", searchForm);
		dropdownContainer.className = "dropdown-menu";

		//Initializate menu
		ComunicWeb.components.searchForm.init(searchInput, dropdownContainer);
	}
};