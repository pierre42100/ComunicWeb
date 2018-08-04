/**
 * Display informations about pages we are not allowed to show
 * 
 * Handles request
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.pages.userPage.accessForbidden = {

	/**
	 * Display the page for user with forbidden access
	 * 
	 * @param {Integer} userID The ID of the target user
	 * @param {Object} params Additional parametres
	 * @param {HTMLElement} target The target element on the screen
	 */
	display: function(id, params, target){
		
		//Check if user is signed in or not
		if(!signed_in()){

			//Inform user that he must sign in to continue
			elem = ComunicWeb.common.messages.createCalloutElem(
				lang("user_page_forbidden_err_sign_in_title"),
				lang("user_page_forbidden_err_sign_in_message"),
				"danger"
			);

			elem.className += " user_access_denied_signed_out";

			target.appendChild(elem);

			return;

		}

		//Fetch informations about the user
		ComunicWeb.user.userInfos.getUserInfos(id, function(userinfos){
			
			//Check for errors
			if(userinfos.error){

				//Inform user it is impossible for him to access this page
				elem = ComunicWeb.common.messages.createCalloutElem(
					lang("user_page_forbidden_err_access_denied_title"),
					lang("user_page_forbidden_access_denied_message"),
					"danger"
				);

				elem.className += " user_access_denied_signed_out";

				target.appendChild(elem);

				return;
			}

			//Show a dialog with basic user informations
			ComunicWeb.pages.userPage.accessForbidden.showBasicInfos(userinfos, target);


		});

	},

	/**
	 * Show basic user informations
	 * 
	 * @param {Object} userInfos Informations about the user to display
	 * @param {HTMLElement} target Target element for user informations
	 */
	showBasicInfos: function(userInfos, target){

		//Update page title
		document.title = userInfos.firstName + " " + userInfos.lastName;
		
		//Create box root
		var boxRoot = createElem2({
			appendTo: target,
			type: "div",
			class: "box box-primary box-user-access-denied" 
		});
		
		//Create box body
		var boxBody = createElem2({
			appendTo: boxRoot,
			class: "box-body box-profile",
			type: "div"
		});

		//Add user profile image
		var profileImage = createElem2({
			appendTo: boxBody,
			type: "img",
			class: "profile-user-img img-responsive img-circle",
			src: userInfos.accountImage,
		});

		//Add user name
		var userName = createElem2({
			appendTo: boxBody,
			type:"h3",
			class: "profile-username text-center",
			innerHTML: userInfos.firstName + " " + userInfos.lastName,
		});

		//Add a message to inform access to the page was denied
		var infosMsg = createElem2({
			appendTo: boxBody,
			type: "p",
			class: "text-center",
			innerHTML: lang("user_page_forbidden_private_account_notice")
		});

		//Add friendship request message
		var requestArea = createElem2({
			appendTo: boxBody,
			type: "div",
			class: "text-center",
			innerHTML: lang("user_page_forbidden_loading")
		});

		//Load friendship infos
		ComunicWeb.pages.userPage.friendshipStatus.display(userInfos.userID, requestArea);
	}

}