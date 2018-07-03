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

			/**
			 * Make an API request with a prepared form data object
			 */
			makeFormDatarequest: function(apiURI, data, requireLoginTokens, nextAction){},

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
			 * Initializate languages
			 */
			initLanguages: function(){},

			//TODO : implement

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

			/**
			 * Create and return a callout element
			 */
			createLoadingCallout: function(target){},

			/**
			 * Create dialog skeleton
			 */
			createDialogSkeleton: function(info){},

			/**
			 * Create and display a confirmation dialog
			 */
			confirm: function(message, callback){},

			/**
			 * Prompt the user to input a string
			 */
			inputString: function(title, message, defaultValue, callback){},
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

			/**
			 * Handles and display SyntaxtError
			 */
			syntaxtError: function(error, additional){},
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
			 * Refresh the current page
			 */
			refresh_current_page: function(){},

			/**
			 * Safely trigger URL update
			 */
			update_uri: function(title, uri){},

			/**
			 * Inform of page location update
			 */
			location_updated: function(new_location){},

			/**
			 * Prepare a template load by specifying datas
			 */
			prepareLoadTemplate: function(){},

			/**
			 * Load, parse and show an HTML template
			 */
			getAndShowTemplate: function(targetElem, dataTemplate, templateURI, nextAction, cleanContainer){},

			/**
			 * Convert a JSON object into html elements
			 */
			convertJSONobjectTOhtmlElement: function(parentNodeChilds, values){},

			/**
			 * Get and show a JSON template
			 */
			getAndShowJSONtemplate: function(targetElem, templateURI, additionalData, afterParsingJSONtemplate, cleanContainer){},
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
			 * @var {object} Cache container
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
		 * Account component
		 */
		account: {

			/**
			 * Interface
			 */
			interface: {
				//TODO : implement
			},

			/**
			 * Account export
			 */
			export: {
				
				/**
				 * UI controller
				 */
				ui: {
					//TODO : implement
				},

				/**
				 * Worker
				 */
				worker: {
					//TODO: implement
				},
			},

		},

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

				//TODO : implement
			},
		},

		/**
		 * Pages bottom
		 */
		bottom: {

			/**
			 * Main bottom script file
			 */
			main: {
				//TODO : implement
			},

		},

		/**
		 * Language picker
		 */
		langPicker: {
			//TODO : implement
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
		 * Settings component
		 */
		settings: {

			/**
			 * Settings interface
			 */
			interface: {
				//TODO : implement
			},

			/**
			 * Settings helper
			 */
			helper: {
				//TODO : implement
			},

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

			/**
			 * Friends list modal box
			 */
			listModal: {
				//TODO : implement
			},

			/**
			 * Friends user interface
			 */
			ui: {
				//TODO: implement
			},

			/**
			 * Friends interface
			 */
			interface: {
				//TODO : implement
			},

			/**
			 * Friends utilities
			 */
			utils: {
				//TODO : implement
			},

			/**
			 * Friends actions
			 */
			actions: {
				//TODO : implement
			}
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
			},

			/**
			 * Unread conversations list dropdown
			 */
			unreadDropdown: {
				//TODO : implementd
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

			/**
			 * Emojie picker
			 */
			picker: {
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
			 * Visibility levels
			 */
			visibilityLevels: {
				//TODO : implement
			},

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
			},

			/**
			 * Post editor
			 */
			edit: {
				//TODO : implement
			},

			/**
			 * Post actions
			 */
			actions: {
				//TODO : implement
			}

		},

		/**
		 * Comments component
		 */
		comments: {

			/**
			 * Comments UI interface
			 */
			ui:{
				//TODO : implement
			},

			/**
			 * Comment actions
			 */
			actions: {
				//TODO : implement
			},

			/**
			 * Comments interface
			 */
			interface: {
				//TODO : implement
			},

			/**
			 * Comments creation form
			 */
			form: {
				//TODO : implement
			},

			/**
			 * Comments editor
			 */
			editor: {
				//TODO : implement
			},

			/**
			 * Comments utilities
			 */
			utils: {
				//TODO : implement
			}

		},

		/**
		 * Modern textarea handler
		 */
		textarea: {

		},

		/**
		 * Comunic specific text parser
		 */
		textParser: {
			//TODO : implement
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


		/**
		 * Notifications components
		 */
		notifications: {

			/**
			 * Notifications menu dropdown
			 */
			dropdown:{

				//TODO : implement

			},

			/**
			 * Notification refresh service
			 */
			service: {
				//TODO : implement
			},

			/**
			 * Notifications interface
			 */
			interface: {
				//TODO : implement
			},

			/**
			 * Notifications UI
			 */
			ui: {
				//TODO : implement
			},

			/**
			 * Notifications utilities
			 */
			utils: {
				//TODO : implement
			}

		},

		/**
		 * Groups component
		 */
		groups: {

			/**
			 * API interface
			 */
			interface: {
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
		 * Post page
		 */
		postPage: {

			/**
			 * Post page main script
			 */
			main: {

				//TODO: implement

			},

		},

		/**
		 * Latest posts page
		 */
		latestPosts: {

			/**
			 * Main script
			 */
			main: {
				//TODO: implement
			},

		},

		/**
		 * Conversations page
		 */
		conversations: {

			/**
			 * Main script
			 */
			main: {
				//TODO : implement
			},

			/**
			 * Conversations list pane
			 */
			listPane: {
				//TODO : implement
			},

			/**
			 * Conversation pane
			 */
			conversation: {
				//TODO : implement
			},
			

			/**
			 * Conversation page utilities
			 */
			utils: {
				//TODO : implement
			},
		},

		/**
		 * Groups page
		 */
		groups: {

			/**
			 * Groups page main script
			 */
			main: {
				//TODO : implement
			},

			/**
			 * Groups pages
			 */
			pages: {
				
				/**
				 * Main page
				 */
				main: {
					//TODO : implement
				},

				/**
				 * Create a group page
				 */
				create: {
					//TODO : implement
				},

				/**
				 * Main group page
				 */
				group: {
					//TODO : implement
				},

			},

			/**
			 * Groups sections
			 */
			sections: {

				/**
				 * Header section
				 */
				header: {
					//TODO : implement
				},

			},
		},

		/**
		 * User settings page
		 */
		settings: {

			/**
			 * Main script
			 */
			main: {
				//TODO : implement
			},
			
			/**
			 * Navigation pane
			 */
			navigationPane: {
				//TODO : implement
			},

			/**
			 * Settings sections list
			 */
			sectionsList: {
				//TODO : implement
			},

			/**
			 * Settings sections script
			 */
			sections: {

				/**
				 * General section
				 */
				general: {
					//TODO : implement
				},

				/**
				 * Security section
				 */
				security: {
					//TODO : implement
				},

				/**
				 * Password section
				 */
				password: {
					//TODO : implement
				},

				/**
				 * Account image section
				 */
				accountImage: {
					//TODO : implement
				},

				/**
				 * Privacy section
				 */
				privacy: {
					//TODO : implement
				},
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
		 * Create account controller
		 */
		createAccount: {

			//TODO : implement

		},

		/**
		 * Account created controller
		 */
		accountCreated: {
			//TODO : implement
		},

		/**
		 * Password forgotten page
		 */
		passwordForgotten: {

			/**
			 * Main script
			 */
			main: {
				//TODO : implement
			},

			/**
			 * Ask user email step
			 */
			promptEmail: {
				//TODO : implement
			},

			/**
			 * Ask user reset option
			 */
			promptOption: {
				//TODO : implement
			},

			/**
			 * Option : send a mail to the admin
			 */
			mailAdmin: {
				//TODO : implement
			},

			/**
			 * Option : prompt security questions
			 */
			promptSecurityQuestions: {
				//TODO : implement
			},

		},

		/**
		 * Password reset page
		 */
		resetPassword: {

			/**
			 * Main script
			 */
			main: {
				//TODO : implement
			},

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