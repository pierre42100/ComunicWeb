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
		menuBar.className = "main-header";

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
		

		//Save login information in menubar before continuing
		menuContainer.setAttribute("forActiveUser", signed_in());

		//Call specific menu
		if(signed_in()){
			//Call authenticated menubar
			ComunicWeb.components.menuBar.authenticated.addElements(menuContainer);
		}
		else {
			//Call not-logged-in menubar
			ComunicWeb.components.menuBar.notAuthenticated.addElements(menuContainer);
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