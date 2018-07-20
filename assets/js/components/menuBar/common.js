/**
 * Menu bar object - common methods
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.menuBar.common = {
	/**
	 * Display menu bar
	 * 
	 * @return {Boolean} True for a success
	 */
	display: function(){
		//Log message
		ComunicWeb.debug.logMessage("Display menu bar");

		//Try to get menubar element
		var menuBar = byId("menuBar");

		//We check if the menubar is present or not on the page
		if(menuBar){

			//We check if menubar is made for a logged user when not any is logged in or vice-versa
			if(menuBar.getAttribute("forActiveUser") !== ComunicWeb.user.userLogin.getUserLoginState().toString()){
				//Remove previously created menuBar
				this.reset(menuBar);
			}
			else {
				//Nothing to be done
				ComunicWeb.debug.logMessage("Info: The menubar is already present on the page");
				return true;
			}
			
		}

		//So we have to initializate it
		//Create menubar element
		var menuBar = createElem("header");
		byId("wrapper").insertBefore(menuBar, byId("wrapper").childNodes[0]);
		menuBar.id = "menuBar";

		//Initializate the menubar
		return this.init(menuBar);
	},

	/**
	 * Initializate a menubar
	 * 
	 * @param {HTMLElement} menuContainer The menu container
	 * @return {Boolan} True for a success
	 */
	init: function(menuContainer){
		//Log action
		ComunicWeb.debug.logMessage("Info: Initializate a menuBar in element : '"+menuContainer.id+"'");

		//Change menu container informations
		menuContainer.className = "main-header";

		//Create main menu
		var menuElem = createElem("div", menuContainer);
		menuElem.className = "navbar navbar-static-top";

		//Create nav element
		var navElem = createElem("nav", menuElem);
		navElem.className = "navbar navbar-static-top";

		//Create conatiner
		var containerElem = createElem("div", navElem);
		containerElem.className = "container";

		//Create navbar header
		var navbarHeader = createElem("div", containerElem);
		navbarHeader.className = "navbar-header";

			//Create site name link
			var siteNameElem = createElem("a", navbarHeader);
			siteNameElem.className = "navbar-brand";
			siteNameElem.innerText = "Comunic";
			siteNameElem.onclick = (function(){
				ComunicWeb.common.page.openPage("home");
			});

			//Create navbar collapsed button
			var navbarCollapsedButton = createElem("button", navbarHeader);
			navbarCollapsedButton.type = "button";
			navbarCollapsedButton.className = "navbar-toggle collapsed";
			navbarCollapsedButton.setAttribute("data-toggle", "collapse");
			navbarCollapsedButton.setAttribute("data-target", "#navbar-collapse");

				//Create navbar icon
				var navbarCollapsIcon = createElem("i", navbarCollapsedButton);
				navbarCollapsIcon.className = "fa fa-bars";


		//Save login information in menubar before continuing
		menuContainer.setAttribute("forActiveUser", signed_in());

		//Call specific menu
		if(signed_in()){
			//Call authenticated menubar
			ComunicWeb.components.menuBar.authenticated.addElements(containerElem);
		}
		else{
			//Call not-logged-in menubar
			ComunicWeb.components.menuBar.notAuthenticated.addElements(containerElem);
		}
	},

	/**
	 * Reset a specified menubar
	 * 
	 * @param {HTMLElement} menuBar The menuBar to reset
	 * @return {Boolean} True for a success
	 */
	reset: function(menuBar){

		//Log action
		ComunicWeb.debug.logMessage("Cleaning a menuBar element.");

		//Perform action
		return emptyElem(menuBar);

	}
};