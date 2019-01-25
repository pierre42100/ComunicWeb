<?php
/**
 * PHP dev config for the website
 *
 * @author Pierre HUBERT
 */

class Dev {

	/**
	 * API access and credentials
	 */
	const API_URL = "http://devweb.local/comunic/api/";
	const API_SERVICE_NAME = "ComunicWeb";
	const API_SERVICE_TOKEN = "12XU67pJUlnNQ";

	/**
	 * Site URL
	 */
	const SITE_URL = "http://devweb.local/comunic/v2/";

	/**
	 * About website access
	 */
	const ABOUT_WEBSITE_URL = "http://127.0.0.1:4000/";

	/**
	 * Site production mode
	 */
	const PROD_MODE = false;

	/**
	 * Path to assets (relative to the base project)
	 */
	const PATH_ASSETS = "assets/";

	/**
	 * URL to assets
	 */
	const ASSETS_URL = "http://devweb.local/comunic/v2/assets/";

	/**
	 * Third party CSS files
	 */
	const THIRD_PARTY_CSS = array(
		//CSS files - adminLTE distribution / bootstrap / plugins
		"3rdparty/adminLTE/bootstrap/css/bootstrap.min.css",
		"3rdparty/adminLTE/plugins/font-awesome/css/font-awesome.min.css",
		"3rdparty/adminLTE/plugins/ionicons/css/ionicons.min.css",
		"3rdparty/adminLTE/plugins/googleFonts/css.css",

		//iCheck
		"3rdparty/adminLTE/plugins/iCheck/square/blue.css",
		"3rdparty/adminLTE/plugins/iCheck/flat/blue.css",
		"3rdparty/adminLTE/plugins/iCheck/minimal/blue.css",


		"3rdparty/adminLTE/plugins/select2/select2.min.css",
		"3rdparty/adminLTE/dist/css/AdminLTE.min.css",
		"3rdparty/adminLTE/dist/css/skins/_all-skins.min.css",

		//Light box
		"3rdparty/lightbox/ekko-lightbox.min.css",

		//Datepicker
		"3rdparty/adminLTE/plugins/datepicker/datepicker3.css",

		//Timepicker
		"3rdparty/adminLTE/plugins/timepicker/bootstrap-timepicker.min.css",

		//VideoJS
		//"3rdparty/videojs/6.4.0/video-js.min.css",

		//Emoji picker
		"3rdparty/wdt-emoji/wdt-emoji-bundle.css",

		//SCEditor (BBCode editor)
		"css/common/custom-sceditor.css"
	);

	/**
	 * Third party Javascript files
	 */
	const THIRD_PARTY_JS = array(
		//Jquery
		"3rdparty/adminLTE/plugins/jQuery/jquery-2.2.3.min.js",
		
		//Bootstrap
		"3rdparty/adminLTE/bootstrap/js/bootstrap.min.js",
		
		//JQuery UI
		"3rdparty/adminLTE/plugins/jquery-ui/jquery-ui.min.js",
		
		//iCheck
		"3rdparty/adminLTE/plugins/iCheck/icheck.min.js",
		
		//Slimscroll
		"3rdparty/adminLTE/plugins/slimScroll/jquery.slimscroll.min.js",
		
		//Select2
		"3rdparty/adminLTE/plugins/select2/select2.min.js",
		
		//adminLTE script
		"3rdparty/adminLTE/dist/js/app.min.js",

		//Bootstrap notify
		"3rdparty/bootstrap-notify-3.1.3.min.js",

		//Twitter emojies
		"3rdparty/twemoji/2/twemoji.min.js",

		//Textarea auto-size
		"3rdparty/jquery.textarea_autosize/jquery.textarea_autosize.min.js",

		//Light box
		"3rdparty/lightbox/ekko-lightbox.min.js",

		//ChartJS
		"3rdparty/adminLTE/plugins/chartjs/Chart.min.js",

		//Jquery hotkeys
		"3rdparty/jquery.hotkeys.js",

		//Bootstrap-WYSIWYG
		"3rdparty/bootstrap-wysiwyg.js",

		//Datepicker
		"3rdparty/adminLTE/plugins/datepicker/bootstrap-datepicker.js",

		//Timepicker
		"3rdparty/adminLTE/plugins/timepicker/bootstrap-timepicker.js",

		//VideoJS
		//"3rdparty/videojs/6.4.0/video.min.js",

		//Emoji picker
		"3rdparty/wdt-emoji/emoji.min.js",
		"3rdparty/wdt-emoji/wdt-emoji-bundle.js",

		//Identicon.JS
		"3rdparty/identicon.js/pnglib.js",
		"3rdparty/identicon.js/identicon.js",

		//FileSaver.js
		"3rdparty/FileSaver.js",

		//JSZip
		"3rdparty/jszip/jszip.min.js",

		//JSZip utils
		"3rdparty/jszip-utils/jszip-utils.js",

		//SCEditor (BBCode editor)
		"3rdparty/sceditor/sceditor.min.js",
		"3rdparty/sceditor/formats/bbcode.js",
		"3rdparty/sceditor/formats/xhtml.js",
		"3rdparty/sceditor/icons/material.js",

		//JS BBCode Parser
		"3rdparty/js-bbcode-parser/bbcode-config.js",
		"3rdparty/js-bbcode-parser/bbcode-parser.js",
	);

	/**
	 * Application CSS files
	 */
	const APP_CSS = array(
		//App stylesheets - common stylesheets
		"css/common/global.css",
		"css/common/page/error.css",
		"css/common/page/waitSplashScreen.css",
		"css/common/network/networkError.css",

		//Components stylesheets
			//Menubar stylesheet
			"css/components/menuBar.css",

			//Language picker stylesheet
			"css/components/languagePicker.css",
			
			//Searchform stylesheet
			"css/components/searchForm.css",
			
			//Friendbar stylesheet
			"css/components/friends/friendsBar.css",
			"css/components/friends/listModal.css",
			"css/components/friends/ui.css",
			
			//Conversations stylesheet
			"css/components/conversations/manager.css",
			"css/components/conversations/windows.css",
			"css/components/conversations/list.css",
			"css/components/conversations/unreadDropdown.css",
			
			//User selector stylesheet
			"css/components/userSelect/userSelect.css",

			//Emojies
			"css/components/emoji/parser.css",
			"css/components/emoji/picker.css",

			//Posts component
			"css/components/posts/ui.css",
			"css/components/posts/form.css",
			"css/components/posts/edit.css",

			//Movies picker
			"css/components/movies/picker.css",

			//Comments component
			"css/components/comments/ui.css",
			"css/components/comments/form.css",

			//Notifications component
			"css/components/notifications/dropdown.css",
			"css/components/notifications/ui.css",

			//Incognito mode component
			"css/components/incognito/ui.css",

			//Calls component
			"css/components/calls/callWindow.css",
			"css/components/calls/ringScreen.css",

			//Pacman (easter egg) stylesheet
			"css/components/pacman.css",

		//Pages stylesheets
			//User Page
			"css/pages/userPage/main.css",
			"css/pages/userPage/accessForbidden.css",
			"css/pages/userPage/profileInfos.css",
			"css/pages/userPage/posts.css",

			//Post page
			"css/pages/postPage/main.css",

			//Conversations page
			"css/pages/conversations/main.css",
			"css/pages/conversations/listPane.css",
			"css/pages/conversations/conversation.css",

			//Groups page
				//Groups pages
				"css/pages/groups/pages/main.css",
				"css/pages/groups/pages/create.css",
				"css/pages/groups/pages/group.css",
				"css/pages/groups/pages/settings.css",
				"css/pages/groups/pages/members.css",
				"css/pages/groups/pages/forbidden.css",

				//Groups sections
				"css/pages/groups/sections/header.css",
				"css/pages/groups/sections/membershipBlock.css",
				"css/pages/groups/sections/posts.css",


			//Settings page
				//Sections sections
				"css/pages/settings/sections/general.css",
				"css/pages/settings/sections/language.css",
				"css/pages/settings/sections/security.css",
				"css/pages/settings/sections/password.css",
				"css/pages/settings/sections/accountImage.css",
				"css/pages/settings/sections/privacy.css",

			//Latest post page stylesheet
			"css/pages/latestPosts/main.css",

			//User account page
			"css/pages/settings/main.css",

			//Create account page
			"css/pages/createAccount.css",

			//Password forgotten page
			"css/pages/passwordForgotten/main.css",
			"css/pages/passwordForgotten/promptOption.css",
			"css/pages/passwordForgotten/mailAdmin.css",

			//Password reset page
			"css/pages/resetPassword/main.css",

			//Search page
			"css/pages/search/main.css"
	);

	/**
	 * Application JS files
	 */
	const APP_JS = array(

		//Utilities
		"js/common/utils.js",

		//Functions schema
		"js/common/functionsSchema.js",

		//Pages list
		"js/pagesList.js",


		//App scripts -- common scripts
		"js/common/cacheManager.js",
		"js/common/network.js",
		"js/common/api.js",
		"js/common/errors.js",
		"js/common/messages.js",
		"js/common/langs.js",
		"js/common/url.js",
		"js/common/jsFiles.js",
		"js/common/debug.js",
		"js/common/page.js",
		"js/common/pageTitle.js",
		"js/common/notifications.js",
		"js/common/formChecker.js",
		"js/common/date.js",
		"js/common/system.js",

		//Languages
		"js/langs/en.inc.js",
		"js/langs/fr.inc.js",

		//Components
			//Account component
			"js/components/account/interface.js",

				//Account export
				"js/components/account/export/ui.js",
				"js/components/account/export/worker.js",

			//Mail caching
			"js/components/mailCaching.js",
			
			
			//Search form
			"js/components/search/interface.js",
			"js/components/search/form.js",
			"js/components/search/ui.js",
			"js/components/search/utils.js",

			//Settings
			"js/components/settings/interface.js",
			"js/components/settings/helper.js",
			
			//Main menubar
			"js/components/menuBar/common.js",
			"js/components/menuBar/notAuthenticated.js",
			"js/components/menuBar/authenticated.js",

			//Bottom view
			"js/components/bottom/links.js",
			"js/components/bottom/main.js",

			//Language picker
			"js/components/languagePicker.js",
			
			//Friends components
			"js/components/friends/friendsList.js",
			"js/components/friends/friendsBar.js",
			"js/components/friends/ui.js",
			"js/components/friends/listModal.js",
			"js/components/friends/interface.js",
			"js/components/friends/utils.js",
			"js/components/friends/actions.js",
			
			//Private conversations
			"js/components/conversations/manager.js",
			"js/components/conversations/list.js",
			"js/components/conversations/windows.js",
			"js/components/conversations/chatWindows.js",
			"js/components/conversations/interface.js",
			"js/components/conversations/service.js",
			"js/components/conversations/cachingOpened.js",
			"js/components/conversations/utils.js",
			"js/components/conversations/unreadDropdown.js",
			"js/components/conversations/messageEditor.js",
			
			//User selector
			"js/components/userSelect/userSelect.js",

			//Emojies
			"js/components/emoji/parser.js",
			"js/components/emoji/list.js",
			"js/components/emoji/picker.js",

			//Like button
			"js/components/like/button.js",
			"js/components/like/interface.js",

			//Posts component
			"js/components/posts/actions.js",
			"js/components/posts/visibilityLevels.js",
			"js/components/posts/interface.js",
			"js/components/posts/ui.js",
			"js/components/posts/form.js",
			"js/components/posts/edit.js",

			//Comments component
			"js/components/comments/ui.js",
			"js/components/comments/actions.js",
			"js/components/comments/interface.js",
			"js/components/comments/form.js",
			"js/components/comments/editor.js",
			"js/components/comments/utils.js",

			//Modern textarea handler
			"js/components/textarea.js",

			//Comunic custom text parser
			"js/components/textParser.js",

			//Countdown timer
			"js/components/countdown.js",

			//Movies
			"js/components/movies/interface.js",
			"js/components/movies/picker.js",

			//Notifications
			"js/components/notifications/dropdown.js",
			"js/components/notifications/service.js",
			"js/components/notifications/interface.js",
			"js/components/notifications/song.js",
			"js/components/notifications/ui.js",
			"js/components/notifications/utils.js",

			//Groups component
			"js/components/groups/interface.js",
			"js/components/groups/utils.js",
			"js/components/groups/info.js",

			//Virtual directory component
			"js/components/virtualDirectory/interface.js",

			//Dark theme component
			"js/components/darkTheme.js",

			//Incognito mode component
			"js/components/incognito/ui.js",
			"js/components/incognito/management.js",
			"js/components/incognito/keyboard.js",

			//Calls compontent
			"js/components/calls/interface.js",
			"js/components/calls/controller.js",
			"js/components/calls/callWindow.js",
			"js/components/calls/currentList.js",
			"js/components/calls/userMedia.js",
			"js/components/calls/ringScreen.js",

			//Pacman component (easter egg)
			"js/components/pacman.js",

		//User scripts
		"js/user/loginTokens.js",
		"js/user/userLogin.js",
		"js/user/userInfos.js",
			

		//Pages scripts
			//Home page
			"js/pages/home/home.js",
			"js/pages/home/landingPage.js",
			
			//User page
			"js/pages/userPage/main.js",
			"js/pages/userPage/accessForbidden.js",
			"js/pages/userPage/friendshipStatus.js",
			"js/pages/userPage/profileInfos.js",
			"js/pages/userPage/posts.js",

			//Post page
			"js/pages/postPage/main.js",
			
			//Latest posts page
			"js/pages/latestPosts/main.js",

			//Conversations page
			"js/pages/conversations/main.js",
			"js/pages/conversations/listPane.js",
			"js/pages/conversations/conversation.js",
			"js/pages/conversations/utils.js",


			//Groups page
			"js/pages/groups/main.js",

				//Groups sub pages
				"js/pages/groups/pages/main.js",
				"js/pages/groups/pages/create.js",
				"js/pages/groups/pages/group.js",
				"js/pages/groups/pages/settings.js",
				"js/pages/groups/pages/members.js",
				"js/pages/groups/pages/forbidden.js",

				//Groups sections
				"js/pages/groups/sections/header.js",
				"js/pages/groups/sections/membershipBlock.js",
				"js/pages/groups/sections/posts.js",
				"js/pages/groups/sections/followBlock.js",


			//User settings page
			"js/pages/settings/main.js",
			"js/pages/settings/navigationPane.js",
			"js/pages/settings/sectionsList.js",

				//Settings sections
				"js/pages/settings/sections/general.js",
				"js/pages/settings/sections/language.js",
				"js/pages/settings/sections/security.js",
				"js/pages/settings/sections/password.js",
				"js/pages/settings/sections/accountImage.js",
				"js/pages/settings/sections/privacy.js",

			//Login page
			"js/pages/login.js",

			//Create account page
			"js/pages/createAccount.js",
			"js/pages/accountCreated.js",

			//Password forgotten page
			"js/pages/passwordForgotten/main.js",
			"js/pages/passwordForgotten/promptEmail.js",
			"js/pages/passwordForgotten/promptOption.js",
			"js/pages/passwordForgotten/mailAdmin.js",
			"js/pages/passwordForgotten/promptSecurityQuestions.js",
			
			//Reset password page
			"js/pages/resetPassword/main.js",

			//Logout page
			"js/pages/logout.js",

			//Virtual directory page
			"js/pages/virtualDirectory/page.js",

			//Search page
			"js/pages/search/main.js",

		//Create shortcuts for common functions
		"js/common/shorcuts.js",
		"js/common/helpers.js",

		//Init script
		"js/init.js",
	);

	/**
	 * Language settings
	 */
	const LANGUAGE_PATH = "js/langs/";
	const DEFAULT_LANGUAGE = "en";

	/**
	 * Templates settings
	 */
	const TEMPLATES_PATH = "templates/";
}