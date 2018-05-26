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
		
		//Create form target
		var form = createElem2({
			appendTo: target,
			type: "div"
		});

		//Add messages target
		var messagesTarget = createElem2({
			appendTo: form,
			type: "div"
		});

		//Add notice
		add_p(form, "Please answer your security questions now, in order to reset your password.");
		add_p(form, "Do not worry about lowercase and uppercase letters.");

		//Process the questions
		var inputs = [];

		questions.forEach(function(question){

			//Create the input
			var input = createFormGroup({
				target: form,
				label: question,
				placeholder: "Your answer to the question",
				type: "text"
			});
			inputs.push(input);

		});

		//Add submit button
		var submit = createElem2({
			appendTo: form,
			type: "div",
			class: "btn btn-primary",
			innerHTML: "Submit"
		});

		
		//Make submit button lives
		submit.addEventListener("click", function(e){

			//Check if another request is already pending
			if(submit.disabled) return;

			//Check the inputs
			var answers = [];
			inputs.forEach(function(input){
				answers.push(input.value);
			});

			//Send a request to the server
			submit.disabled = true;

			//Add loading message
			emptyElem(messagesTarget);
			messagesTarget.appendChild(ComunicWeb.common.messages.createCalloutElem(
				"Loading", 
				"Please wait while we are checking your security answers...",
				"info"));
			
			ComunicWeb.components.account.interface.resetPasswordWithSecurityAnswers(email, answers, function(result){

				submit.disabled = false;
				emptyElem(messagesTarget);

				//Check for errors
				if(result.error){
					messagesTarget.appendChild(ComunicWeb.common.messages.createCalloutElem(
						"Error",
						"The server rejected your security answers, please check them...",
						"danger"
					));
					return;
				}

				//Redirect to reset page
				openPage("reset_password?token=#" + result.reset_token);

			});
		});
	},
}