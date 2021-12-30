/**
 * Menubar for authenticated users complements
 * 
 * @author Pierre HUBERT
 */

const AuthenticatedMenuBar = {

	/**
	 * Dropdown menu links list
	 */
	dropdownMenuLinksList: [

		//Conversations
		{
			innerLang: "menu_bar_action_conversations",
			targetPage: "conversations",
			icon: "fa-comments-o"
		},

		//Groups list
		{
			innerLang: "menu_bar_action_groups",
			targetPage: "groups",
			icon: "fa-group"
		},

		//Dark theme
		{
			innerLang: "menu_bar_action_dark_theme",
			onclick: function(b){AuthenticatedMenuBar.darkThemeButtonClicked(true, b)},
			oninit: function(b){AuthenticatedMenuBar.darkThemeButtonClicked(false, b)},
			icon: "fa-sun-o"
		},

		//Settings list
		{
			innerLang: "menu_bar_action_settings",
			targetPage: "settings",
			icon: "fa-gear"
		},

		//Logout link
		{
			innerLang: "_menu_bar_action_logout",
			targetPage: "logout",
			icon: "fa-sign-out"
		}

	],

	/**
	 * Add authenticated user specific elements
	 * 
	 * @param {HTMLElement} container The container element of the Menubar
	 */
	addElements: function(container){

		// Site name
		createElem2({
			appendTo: container,
			type: "a",
			class: "logo",
			internalHref: "#",
			innerHTML: "<span class='logo-mini'>C</span><span class='logo-lg'>Comunic</span>"
		});

		// Navbar
		var navBar = createElem2({
			appendTo: container,
			type: "nav",
			class: "navbar navbar-static-top"
		});

		// Sidebar toggle
		createElem2({
			appendTo: navBar,
			type: "a",
			class: "sidebar-toggle",
			href: "#",
		}).setAttribute("data-toggle", "offcanvas");

		//Create an auto-collapsed element
		var navbarCollapse = createElem("div", navBar);
		navbarCollapse.id = "navbar-collapse";
		navbarCollapse.className = "navbar-collapse pull-left collapse";

		//Create navbar elements list
		var navbarCollapseElemList = createElem("ul", navbarCollapse);
		navbarCollapseElemList.className = "nav navbar-nav";

		//Add search form
		//this.addSearchForm(navbarCollapseElemList);

		//Navbar right elements
		var navbarRight = createElem("div", navBar);
		navbarRight.className = "navbar-custom-menu";
		var navbarRightElemList = createElem("ul", navbarRight);
		navbarRightElemList.className = "nav navbar-nav";

		//Add user name
		//this.addUserName(navbarRightElemList);

		//Alternate latest posts button
		this.addAlternateLatestPostsButton(navbarRightElemList);

		//Add friends list button
		//this.addFriendListButton(navbarRightElemList);

		//Add notifications dropdown
		ComunicWeb.components.notifications.dropdown.display(navbarRightElemList);

		//Add dropdown menu
		this.addDropdown(navbarRightElemList);

		// Banner
		const banner = MenubarBanner.addBanner(undefined)
		if(banner) {
			container.parentNode.insertBefore(banner, container.nextElementSibling)
			banner.classList.add("content-wrapper")
		}
		
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


		//Process links list
		var addMenuOption = function(entry){

			var linkButton = createElem2({
				appendTo: dropdownContent,
				type: "li"
			});

			var link = createElem2({
				appendTo: linkButton,
				type: "a",
				href: entry.href,
				innerLang: entry.innerLang,
				innerHTML: entry.innerHTML,
				innerHTMLprefix: entry.icon ? "<i class='fa " + entry.icon + "'></i> " : undefined,
			});

			
			if(entry.targetPage){
				linkButton.onclick = function(){
					openPage(entry.targetPage);
				};
			}

			if(entry.target)
				link.setAttribute("target", entry.target);

			if(entry.onclick){
				linkButton.addEventListener("click", function(){
					entry.onclick(link);
				});
			}

			if(entry.oninit){
				entry.oninit(link);
			}
		

		};

		this.dropdownMenuLinksList.forEach(addMenuOption);

		//Add divider
		createElem2({
			appendTo: dropdownContent,
			type: "li",
			class: "divider"
		});

		BottomLinks().forEach(addMenuOption);
	

		//Return dropdown content element
		return dropdownContent;
	},

	/**
	 * Called this method each time the dark theme button
	 * is clicked
	 * 
	 * @param {Boolean} invert Specify whether dark theme mode should
	 * be inverted or not
	 * @param {HTMLElement} button Button element that has been
	 * clicked
	 */
	darkThemeButtonClicked: function(invert, button){

		if(invert)
			ComunicWeb.components.darkTheme.setEnabled(!ComunicWeb.components.darkTheme.isEnabled());

		//Update icon
		button.getElementsByTagName("i")[0].className =  
			"fa " + (ComunicWeb.components.darkTheme.isEnabled() ? "fa-moon-o" : "fa-sun-o");

	},

	/**
	 * Add alternate latest posts button 
	 * (if the screen is too small to display "Comunic")
	 * 
	 * @param {HTMLElement} target The target for the button
	 */
	addAlternateLatestPostsButton: function(target){
		//Create button
		var button = createElem2({
			type: "li", 
			appendTo: target,
			class: "alternate-latest-posts-button"
		});

		//Create link
		var link = createElem("a", button);
		createElem2({
			type: "i",
			appendTo: link,
			class: "fa fa-history"
		});

		//Makes link lives
		link.addEventListener("click", function(){
			openPage("latest");
		});
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
				openUserPage(userInfos);
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

		//Create form element (large screens)
		var searchForm = createElem("li", navbarElem);
		searchForm.className = "dropdown navbar-form navbar-left messages-menu hidden-xs";
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
		ComunicWeb.components.search.form.init(searchInput, dropdownContainer);

		//Create search link (small screen)
		var searchLinkLi = createElem2({
			appendTo: navbarElem,
			type: "li",
			class: "navbar-left visible-xs"
		});

		var searchLink = createElem2({
			appendTo: searchLinkLi,
			type: "a",
			innerHTML: "Search"
		});

		searchLink.addEventListener("click", function(){
			openPage("search");
			$(navbarElem.parentNode).collapse("toggle");
		});
		
	}
};