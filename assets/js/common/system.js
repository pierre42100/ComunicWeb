/**
 * Application background system functions
 * 
 * @author Pierre HUBERT
 */

const System = {
	/**
	 * Initializate the application
	 * 
	 * @param {String} openPage Specify a page to open
	 * @return {Boolean} True for a success
	 */
	init: async function(openPage){

		//Display Comunic logo
		ComunicWeb.debug.displayComunicLogo();

		//Start init
		ComunicWeb.debug.logMessage("Start initialization...");

		//Enable error reporting
		window.addEventListener("error", function(e){
			ComunicWeb.common.error.syntaxtError(e.error);
		});

		//Disable tooltips
		$(function () {
			$(document.body).tooltip("disable");
		});

		//Enable page URLs detection
		window.location.changed = function(e){
			Page.location_updated(e);
		}


		//Clean current page content
		Page.emptyPage();
		
		//Show a wait splash screen
		Page.showWaitSplashScreen(tr("Starting up..."));

		/**
		 * Language initator
		 */
		ComunicWeb.common.langs.initLanguages();

		/**
		 * Initialize incognito mode detection
		 */
		ComunicWeb.components.incognito.management.init();

		/**
		 * Refresh dark theme mode
		 */
		ComunicWeb.components.darkTheme.refresh();

		/**
		 * Initialize server configuration
		 */
		Page.showWaitSplashScreen(tr("Loading server configuration"));
		try {
			await ServerConfig.ensureLoaded();
		} catch(e) {
			console.error(e)
			ComunicWeb.common.error.fatalError(tr("Failed to load server configuration!"));
			return;
		}

		/**
		 * Get login state
		 */
		Page.showWaitSplashScreen(tr("Refreshing login state"));
		await UserLogin.refreshLoginState();

		// Initialize Websocket if user is connected
		if(signed_in()) {
			Page.showWaitSplashScreen(tr("Connecting to server"));
			await UserWebSocket.Connect();
			await UserWebSocket.WaitForConnected();
		}

		/**
		 * Open a page
		 */
		if(!openPage){
			//Refresh current page
			ComunicWeb.common.page.refresh_current_page();
		}
		else
			//Open specified page
			ComunicWeb.common.page.openPage(openPage);

		//End of init
		ComunicWeb.debug.logMessage("Application is ready !");
	},

	/**
	 * Restart the application
	 * 
	 * @return {Boolean} True for a success
	 */
	restart: function(){
		//Show a wait splashscreen message
		ComunicWeb.common.page.showWaitSplashScreen("Restarting...");

		//Reload the page
		location.href = document.location.href.split("#")[0];
	},

	/**
	 * Reset the application
	 * 
	 * @param {Boolean} complete Specify wether the cache cleaning has to be complete or not (for logout)
	 * @param {String} openPage Specify a page to open once the application is restarted
	 * @return {Boolean} True for a success
	 */
	reset: function(complete, openPage){
		//Show a wait splashscreen message
		ComunicWeb.common.page.showWaitSplashScreen("Reset the application in progress...");

		//Clear intervals
		ComunicWeb.common.cacheManager.cleanIntervals();

		//Clean caches
		ComunicWeb.common.cacheManager.cleanCaches(complete);

		//Init the page again
		this.init(openPage);

		//Success
		return true;
	},
};

ComunicWeb.common.system = System;