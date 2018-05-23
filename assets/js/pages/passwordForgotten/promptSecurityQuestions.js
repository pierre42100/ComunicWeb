/**
 * Prompt user security questions
 * 
 * Password reset page
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.pages.passwordForgotten.promptSecurityQuestions = {

	/**
	 * Prompt user security questions
	 * 
	 * @param {String} email The email of the user
	 * @param {HTMLElement} target The target for the form
	 */
	open: function(email, target){

		//Show loading message
		target.appendChild(ComunicWeb.common.messages.createCalloutElem(
			"Please wait", 
			"Please wait, we are loading your security questions...", 
			"info"));

		//Perform a request on the API
		ComunicWeb.components.account.interface.getSecurityQuestions(email, function(callback){

			//Empty target
			emptyElem(target);

			//Check for errors
			if(callback.error){
				return target.appendChild(ComunicWeb.common.messages.createCalloutElem(
					"Error", 
					"An error occurred while retrieving your security questions...", 
					"danger"));
			}

			//Apply the form
			ComunicWeb.pages.passwordForgotten.promptSecurityQuestions._display_form(email, callback.questions, target);
		});
	},

	/**
	 * Display the security questions input form
	 * 
	 * @param {String} email The email address of the user
	 * @param {Array} questions The questions of the user
	 * @param {HTMLElement} target The target for the form
	 */
	_display_form: function(email, questions, target){
		console.log(questions);
	},
}