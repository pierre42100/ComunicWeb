/**
 * Comunic WebApp schema
 * 
 * @author Pierre HUBERT
 */

/**
 * ComunicWeb main object
 */
var ComunicWeb = {

	/**
	 * Configuration inclusion
	 */
	__config: ComunicConfig,

	/**
	 * List of available pages
	 */
	pagesList:{},

	/**
	 * Common functions
	 */
	common:{
		/**
		 * Application system functions
		 */
		system:{
			/**
			 * Initializate the application
			 */
			init: function(openPage){},

			/**
			 * Restart the application
			 */
			restart: function(){},

			/**
			 * Reset the application
			 */
			reset: function(complete, openPage){},
		},

		/**
		 * API functions
		 */
		api: {
			/**
			 * Make an API request
			 */
			makeAPIrequest: function(apiURI, params, requireLoginTokens, nextAction){},

			//TODO : implement
		},

		/**
		 * Global cache management system
		 */
		cacheManager:{
			//TODO : implement
		},

		/**
		 * Langs functions
		 */
		langs: {
			/**
			 * Return current language
			 */
			getCurrentLanguage: function(){},

			/**
			 * Include and install specified language
			 */
			installLanguage: function(languageID){},

			/**
			 * Initializate languages
			 */
			initLanguages: function(){},

			/**
			 *  Return a string in correct language
			 */
			getTranslatedText: function(stringName, stringParams){},
		},

		/**
		 * Messages functions
		 */
		messages: {

			/**
			 * Create and return a callout element
			 */
			createCalloutElem: function(calloutTitle, calloutMessage, calloutType){},
		},

		/**
		 * Error functions
		 */
		error:{
			/**
			 * Submit an error
			 */
			submitError: function(errorLevel, errorMessage, errorCode, errorData){},

			/**
			 * Handle and show a fatal error
			 */
			fatalError: function(errorMessage, errorCode, errorData){},

			/**
			 * Handle a 404 not found error
			 */
			pageNotFound: function(additionnalData, targetElement){},
		},

		/**
		 * URL functions
		 */
		url:{
			/**
			 * Return current URL opened on the website
			 */
			getCurrentWebsiteURL: function(){},

			/**
			 * Change the current website URI
			 */
			changeURI: function(newTitle, newURI){},
		},

		/**
		 * Page functions
		 */
		page: {
			/**
			 * Empty current page
			 */
			emptyPage: function(createWrapper){},

			/**
			 * Show a full wait splash screen
			 * 
			 * @param {String} message A message to explain the reason of the splash screen (optionnal)
			 */
			showWaitSplashScreen: function(message){},

			/**
			 * Show a transparent wait splash screen
			 */
			showTransparentWaitSplashScreen: function(target){},

			/**
			 * Open a page
			 */
			openPage: function(pageURI, additionnalData){},

			/**
			 * Prepare a template load by specifying datas
			 */
			prepareLoadTemplate: function(){},

			/**
			 * Load, parse and show an HTML template
			 */
			getAndShowTemplate: function(targetElem, dataTemplate, templateURI, nextAction, cleanContener){},

			/**
			 * Convert a JSON object into html elements
			 */
			convertJSONobjectTOhtmlElement: function(parentNodeChilds, values){},

			/**
			 * Get and show a JSON template
			 */
			getAndShowJSONtemplate: function(targetElem, templateURI, additionalData, afterParsingJSONtemplate, cleanContener){},
		},

		/**
		 * Functions to check data input in forms
		 */
		formChecker: {
			/**
  			 * Check an input
			 */
			checkInput: function(input, inFormGroup){},
		},

		/**
		 * Notification system
		 */
		notificationSystem: {
			
			/**
			 * Display a notification
			 */
			showNotification: function(message, notifType, notifDuration, notifTitle){},

		},

		/**
		 * Network common requests
		 */
		network: {

			/**
			 * @var {object} Cache contener
			 */
			cache: {},
			
			/**
			 * Make a get request
			 */
			getRequest: function(url, cache, GETnextAction){},

			/**
			 * Empty network cache
			 */
			emptyCache: function(){},

			/**
			 * Update the status of the network
			 */
			setStatus: function(success){},
		},

		/**
		 * Operations on JS files
		 */
		jsFiles:{

			/**
			 * Include a Javascript file
			 */
			includeFile: function(fileURL){},

			/**
			 * Execute some source code contained in a variable
			 */
			executeJSsource: function(source){},
		},

		/**
		 * The date library
		 */
		date:{
			//TODO: implement
		},
	},

	/**
	 * Debug functions
	 */
	debug:{
		/**
		 * @var {Object} Internal log variable
		 */
		__log: {},

		/**
		 * Display message on browser console
		 */
		logMessage: function(message){},

		/**
		 * Save a new log message
		 */
		saveLogMessage: function(message){},

		/**
		 * Get log content in a string
		 */
		getLogContent: function(){},

		/**
     	 * Display Comunic Logo on the developper console
		 */
		displayComunicLogo: function(){},
	},

	/**
	 * User functions
	 */
	user:{
		/**
		 * Login tokens storage controller
		 */
		loginTokens: {
			/**
			 * Set User tokens
			 */
			setUserTokens: function(tokens, storageType){},

			/**
			 * Check if there is any login tokens available
			 */
			checkLoginTokens: function(){},

			/**
			 * Get login tokens
			 */
			getLoginTokens: function(){},

			/**
			 * Perform user logout
			 */
			deleteLoginTokens: function(){},
		},

		/**
		 * Manage user login
		 */
		userLogin: {
			/**
			 * @var {Boolean} Store user login state (true by default)
			 */
			__userLogin: true,

			/**
			 * @var {Integer} Store the current user ID
			 */
			__userID: 0,


			/**
			 * Tell if user is logged in or not
			 */
			getUserLoginState: function(){},

			/**
			 * Get user ID (if logged in)
			 */
			getUserID: function(){},

			/**
			 * Try to get and store current user ID
			 */
			getCurrentUserId: function(afterGetCurrentUserID){},

			/**
			 * Refresh the user login state
			 */
			refreshLoginState: function(afterLogin){},

			/**
			 * Try to login user
			 */
			loginUser: function(usermail, userpassword, permanentLogin, afterLogin){},

			/**
			 * Logout user
			 */
			logoutUser: function(afterLogout){},
		},
		
		/**
		 * Get user infos
		 */
		userInfos: {
			/**
			 * @var {String} User infos cache
			 */
			usersInfos: {},

			/**
			 * Get user informations
			 */
			getUserInfos: function(userID, afterGetUserInfos, forceRequest){},

			/**
			 * Get multiple users informations
			 */
			getMultipleUsersInfos: function(usersID, afterGetUserInfos, forceRequest){},

			/**
			 * Empty user informations cache
			 * Remove all entries from user informations cache
			 */
			emptyUserInfosCache: function(){},

			/**
			 * Given a query, search for users and return the result
			 */
			search: function(query, afterSearch){},

			/**
			 * Given user IDs (in an array) the function return their names in a string
			 */
			getNames: function(usersID, afterNames){},

			/**
			 * Get advanced informations about a user
			 */
			getAdvancedInfos: function(userID, callback){},

			/**
			 * Get the user ID specified by its folder name
			 */
			getIDfromPath: function(path, callback){},

			/**
			 * Get the ID or the path of a user, depending of what is available
			 */
			getIDorPath: function(userInfos){},

			/**
			 * Empty users cache
			 */
			emptyCache: function(){},
		},
	},

	/**
	 * Application components
	 */
	components: {

		/**
		 * Menubar
		 */
		menuBar: {

			/**
 			 * Menu bar object - common methods
			 */
			common:{
				/**
	 			 * Display menu bar
				 */
				display: function(){},

				/**
				 * Initializate a menubar
				 */
				init: function(menuContainer){},

				/**
				 * Reset a specified menubar
				 */
				reset: function(menuBar){},
			},

			/**
			 * Not authenticated menu bar components
 			 */
			notAuthenticated: {
				/**
				 * Add not-authenticated user specific elements
				 */
				addElements: function(container){},
			},

			/**
 			 * Menubar for authenticated users complements
			 */
			authenticated:{
				/**
				 * Add authenticated user specific elements
				 */
				addElements: function(container){},

				/**
				 * Add dropdown menu
				 */
				addDropdown: function(navbarElem){},

				/**
				 * Add user friends toggle button
				 */
				addFriendListButton: function(navbarElem){},

				/**
				 * Add user name element
				 */
				addUserName: function(navbarElem){},

				/**
				 * Add search form element
				 */
				addSearchForm: function(navbarElem){},
			},
		},

		/**
		 * Mails caching component
		 */
		mailCaching: {
			/**
			 * @var Mail caching variable name
			 */
			__mailCachingVarName: "lastLoginMail",

			/**
			 * Get current cached value
			 */
			get: function(){},

			/**
			 * Set a new mail value
			 */
			set: function(mail){},
		},

		/**
		 * Search form component
		 */
		searchForm: {
			//TODO : implement
		},

		/**
		 * Friends list
		 */
		friends: {
			/**
			 * Friends list caching system
			 */
			list:{
				//TODO : implement
			},

			/**
 			 * Friends bar
			*/
			bar:{
				//TODO : implement
			},
		},

		/**
		 * Conversations
		 */
		conversations:{
			/**
			 * Conversations manager
			 */
			manager:{
				//TODO : implement
			},

			/**
			 * Conversations list windo
			 */
			list:{
				//TODO : implement
			},

			/**
			 * Conversations windows manager
			 */
			windows:{
				//TODO : implement
			},

			/**
 			 * Conversation chat window functions
			 */
			chatWindows: {
				//TODO : implement
			},

			/**
			 * Interface between conversation UI and the API
			 */
			interface:{
				//TODO : implement
			},

			/**
			 * Opened conversations caching system
			 */
			cachingOpened:{
				//TODO : implement
			},

			/**
			 * Conversation service file
			 */
			service:{
				//TODO : implement
			},

			/**
			 * Conversations utilities
			 */
			utils:{
				//TODO : implement
			}
		},

		/**
		 * User selector
		 */
		userSelect:{
			//TODO : implement
		},

		/**
		 * Emoji functions
		 */
		emoji:{

			/**
			 * Emoji parser system
			 */
			parser: {
				//TODO : implement
			},

			/**
			 * Emojies list
			 */
			list: {
				//TODO : implement
			},
			
		},

		/**
		 * Likes handling
		 */
		like:{

			/**
			 * Like buttons
			 */
			button: {
				//TODO : implement
			},

			/**
			 * Likes API interface
			 */
			interface: {
				//TODO : implement
			}

		},

		/**
		 * Posts components
		 */
		posts: {

			/**
			 * Posts communication interface
			 */
			interface: {
				//TODO : implement
			},

			/**
			 * Posts UI
			 */
			ui: {
				//TODO : implement
			},

			/**
			 * Posts creation form
			 */
			form: {
				//TODO : implement
			}

		},

		/**
		 * Modern textarea handler
		 */
		textarea: {

		},

		/**
		 * Countdown timer
		 */
		countdown: {
			//TODO : implement	
		},

		/**
		 * Movies functions
		 */
		movies: {

			/**
			 * Movies communication interface
			 */
			interface: {
				//TODO : implement
			},

			/**
			 * Movies picker
			 */
			picker:{
				//TODO : implement
			},

		},

	},

	/**
	 * Pages controllers
	 */
	pages:{

		/**
		 * Home page
		 */
		home: {
			/**
			 * Common homes functions
			 */
			home:{
				/**
				 * Open home page
				 */
				openHomePage: function(additionnalData, targetElement){},

			},

			/**
			 * Landing home page
			 */
			landingPage:{
				/**
				 * Display home landing page
				 */
				display: function(targetElement){},
			}
		},

		/**
		 * User page
		 */
		userPage: {
			
			/**
			 * Main user page
			 */
			main: {
				
				/**
				 * Open user page
				 */
				open: function(params, target){},

				/**
				 * Open user page specified by user ID
				 */
				openUserPage: function(id, params, target){},

				/**
				 * Display a user page
				 */
				displayUserPage: function(infos, params, target){},

			},

			/**
			 * Page with access forbidden
			 */
			accessForbidden: {
				
				/**
				 * Display the page for user with forbidden access
				 */
				display: function(id, params, target){},

				/**
				 * Show basic user informations
				 */
				showBasicInfos: function(userInfos, target){},

			},

			/**
			 * Handle the rendering of the friendship status
			 */
			friendshipStatus: {

				/**
				 * Display the friendship status
				 */
				display: function(userID, target){},

				//TODO : implement

			},

			/**
			 * Display user profile informations
			 */
			profileInfos: {
				//TODO : implement
			},

			/**
			 * Display user posts
			 */
			posts: {
				//TODO : implement
			},

		},

		/**
		 * Login controller
		 */
		login:{
		   /**
			* Open login page
			*/
			openLoginPage: function(additionnalData, targetElement){},

			/**
			 * Perform user login
			 */
			loginSubmit: function(){},

			/**
			 * Display login error message
			 * 
			 * @return {Boolean} True for a success
			 */
			displayLoginError: function(){},
		},

		/**
		 * Logout controller
		 */
		logout: {
			/**
			 * Open logout page and perform logout
			 */
			openLogoutPage: function(additionnalData, targetElement){},
		},

	},
};