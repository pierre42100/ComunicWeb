/**
 * Prompt user option to reset his password page
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.pages.passwordForgotten.promptOption = {

	/**
	 * Open prompt option page
	 * 
	 * @param {String} email Target email address
	 * @param {HTMLElement} target The target of the parameter
	 * @param {Function} callback
	 */
	open: function(email, target, callback){

		//Display loading message
		createElem2({
			appendTo: target,
			type: "p",
			innerHTML: "Please wait, we are checking available options..."
		});

		//Check if security questions have been set on this account
		ComunicWeb.components.account.interface.checkSecurityQuestionsExistence(email, function(result){

			emptyElem(target);

			//Check for errors
			if(result.error){
				target.appendChild(ComunicWeb.common.messages.createCalloutElem(
					"An error occurred.", 
					"An error occurred while retrieving available options. Please try to refresh the page and start again.", 
					"danger"));
				return;
			}

			//Display available options to the user
			ComunicWeb.pages.passwordForgotten.promptOption._show_options(result.defined, target, callback);
		});


	},

	/**
	 * Display options to the user
	 * 
	 * @param {Boolean} hasSecurityQuestions Specify wether the user can use security
	 * questions to reset his password or not
	 * @param {HTMLElement} target The target of the form
	 * @param {Function} callback
	 */
	_show_options(hasSecurityQuestions, target, callback){

		//Create a form
		var form = createElem2({
			type: "div",
			class: "password-reset-prompt-option-section",
			appendTo: target
		});

		//Message
		createElem2({
			appendTo: form,
			type: "p",
			innerHTML: "Here are your available options to reset your password:"
		});

		if(hasSecurityQuestions){
			//Add an option to answer security questions (if available)
			var securityQuestions = createElem2({
				appendTo: form,
				type: "div",
				class: "btn btn-default",
				innerHTML: "<i class='fa fa-question'></i> Answer your security questions"
			});
		}

		//Add an option to contact admin (always)
		var contact = createElem2({
			appendTo: form,
			type: "div",
			class: "btn btn-default",
			innerHTML: "<i class='fa fa-envelope-o'></i> Contact the administration"
		});
	},

}