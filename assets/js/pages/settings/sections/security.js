/**
 * Settings security section script
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.pages.settings.sections.security = {

	/**
	 * Open security settings section
	 * 
	 * @param {object} args Additionnal arguments
	 * @param {HTMLElement} target The target for the page
	 */
	open: function(args, target){
		
		//Create a box
		var box = createElem2({
			appendTo: target,
			type: "div",
			class: "box box-primary box-security-settings"
		});

		//Add box header
		var boxHead = createElem2({
			appendTo: box,
			type: "div",
			class: "box-header",
		});
		var boxTitle = createElem2({
			appendTo: boxHead,
			type: "h3",
			class: "box-title",
			innerHTML: "Security settings"
		});

		//Create box body
		var boxBody = createElem2({
			appendTo: box,
			type: "div",
			class: "box-body"
		});

		// Append the form to query user password
		this._append_form_prompt_user_password(boxBody);

		// Offer the user to update its password too
		ComunicWeb.pages.settings.sections.password.open(args, target);

		// Offer the user to sign out from its account
		GlobalSignOutSection.open(args, target);
	},

	/**
	 * Append a form to prompt user password
	 * 
	 * @param {HMTLElement} target The target for the form
	 */
	_append_form_prompt_user_password: function(target){

		//Create form contener (allows easier manipulations then)
		var formContener = createElem2({
			appendTo: target,
			type: "form",
			class: "prompt-user-password"
		});

		//Add title
		createElem2({
			appendTo: formContener,
			type: "h4",
			innerHTML: "Password required"
		});

		//Add explanation
		createElem2({
			appendTo: formContener,
			type: "p",
			innerHTML: "In order to protect these sensitive information, your password is required to access this page."
		});

		//User password form
		var passwordInput = createFormGroup({
			target: formContener,
			label: "Your password",
			placeholder: "Your password",
			type: "password"
		});

		//Add submit button
		var sendButton = createElem2({
			appendTo: formContener,
			type: "div",
			class: "btn btn-primary submit-form",
			innerHTML: "Submit"
		});

		//Make submit button lives
		sendButton.onclick = function(){

			//Check the validity of the input
			if(!ComunicWeb.common.formChecker.checkInput(passwordInput, true)){
				notify("Please input your password !", "danger");
				return;
			}

			//Hide send button
			sendButton.style.visibility = "hide";

			//Perform a request over the server to fetch security settings
			ComunicWeb.components.settings.interface.getSecurity(passwordInput.value, function(result){

				//Show send button
				sendButton.style.visibility = "visible";

				//Check for errors
				if(result.error){
					notify("An error occured while retrieving security settings! Please check your password...", "danger");
					return;
				}

				//Remove password input form
				emptyElem(formContener);

				//Show security information update form
				ComunicWeb.pages.settings.sections.security._show_update_form(result, target);
			});
		};

		//Make the submit button triggered when the user hit enter
		formContener.onsubmit = function(){
			sendButton.onclick();
			return false;
		}
	},

	/**
	 * Show security update form
	 * 
	 * @param {object} settings The settings to update
	 * @param {HTMLElement} target The target for the form
	 */
	_show_update_form: function(settings, target){

		//Create form contener
		var formContener = createElem2({
			appendTo: target,
			type: "div",
			class: "security-settings-form"
		})

		//Display a message to explain to the user what is on this page
		createElem2({
			appendTo: formContener,
			type: "p",
			innerHTML: "In this section, you can set two security question that will help you to " + 
				"recover an access to your account if you lose your password. Do not worry about " +
				"uppercase and lowercase characters. <br /> <strong>Warning !</strong> All the fields " +
				"on the page must be filled to get the security questions usable."
		});

		//Display first security question
		var firstSecurityQuestion = createFormGroup({
			target: formContener,
			label: "First security question",
			type: "text",
			placeholder: "Type your question here...",
			value: settings.security_question_1
		});

		//Display first security answer
		var firstSecurityAnswer = createFormGroup({
			target: formContener,
			label: "First security answer",
			type: "text",
			placeholder: "Type your answer here...",
			value: settings.security_answer_1
		});

		//Display second security question
		var secondSecurityQuestion = createFormGroup({
			target: formContener,
			label: "Second security question",
			type: "text",
			placeholder: "Type your question here...",
			value: settings.security_question_2
		});

		//Display second security answer
		var secondSecurityAnswer = createFormGroup({
			target: formContener,
			label: "Second security answer",
			type: "text",
			placeholder: "Type your answer here...",
			value: settings.security_answer_2
		});


		//User password form
		add_space(formContener);
		createElem2({
			appendTo: formContener,
			type: "p",
			innerHTML: "We need your password to update these information..."
		});
		var passwordInput = createFormGroup({
			target: formContener,
			label: "Your password",
			placeholder: "Your password",
			type: "password"
		});

		//Add submit button
		var sendButton = createElem2({
			appendTo: formContener,
			type: "div",
			class: "btn btn-primary submit-form",
			innerHTML: "Update information"
		});

		//Make the send button lives
		sendButton.onclick = function(){

			//Check the values given by the user
			if(!ComunicWeb.common.formChecker.checkInput(passwordInput, true)){
				notify("Please specify your password to submit information!", "danger");
				return;
			}

			//Prepare the request over the server
			var params = {
				security_question_1: firstSecurityQuestion.value,
				security_answer_1: firstSecurityAnswer.value,
				security_question_2: secondSecurityQuestion.value,
				security_answer_2: secondSecurityAnswer.value,

				//Security check
				password: passwordInput.value
			};

			//Hide send button
			sendButton.style.visibility = "hidden";

			//Perform the request on the server
			ComunicWeb.components.settings.interface.setSecurity(params, function(response){

				//Show send button
				sendButton.style.visibility = "visible";

				//Check for errors
				if(response.error){
					notify("An error occurred while trying to update security settings ! Please check your password...", "danger");
					return;
				}

				//Success
				notify("Your security settings have been successfully updated!", "success");
			});
		}
	}
}