/**
 * Reset password page main script
 * 
 * @author Pierre HUBERT
 */
ComunicWeb.pages.resetPassword.main = {

	/**
	 * Open page
	 * 
	 * @param {Object} args Additionnal data passed in the method
	 * @param {element} target Where the page will be applied
	 */
	open: function(args, target){

		//Create page box
		var pageBox = createElem2({
			appendTo: target,
			type: "div",
			class: "box box-primary reset-password-box"
		});

		//Box header
		var boxHeader = createElem2({
			appendTo: pageBox,
			type: "div",
			class: "box-header"
		});

		//Box title
		createElem2({
			appendTo: boxHeader,
			type: "h3",
			class: "box-title",
			innerHTML: "Reset password"
		});

		//Box body
		var boxBody = createElem2({
			appendTo: pageBox,
			type: "div",
			class: "box-body"
		});

		//Create messages target
		var messagesTarget = createElem2({
			appendTo: boxBody,
			type: "div"
		});

		//Add loading message
		messagesTarget.appendChild(ComunicWeb.common.messages.createCalloutElem(
			"Loading", 
			"Please wait while we retrieve a few information...", 
			"info"));
		
		//Get the token (specified after the "#")
		var token = document.location.toString().split("#")[1];

		//Check the token
		if(token == null){
			emptyElem(messagesTarget);
			messagesTarget.appendChild(ComunicWeb.common.messages.createCalloutElem(
				"Error",
				"It seems you followed an invalid link...",
				"danger"
			));
			return;
		}

		//Check the token's validity on the server
		ComunicWeb.components.account.interface.checkPasswordResetToken(token, function(result){

			emptyElem(messagesTarget);

			//Check for errors
			if(result.error){
				messagesTarget.appendChild(ComunicWeb.common.messages.createCalloutElem(
					tr("Error"),
					tr("Your reset password request timed out, or is invalid. Please try again to reset your password..."),
					"danger"
				));
				return;
			}

			//Display reset password form
			ComunicWeb.pages.resetPassword.main.displayResetPasswordForm(boxBody, messagesTarget, token, result);
		});
	},

	/**
	 * Display reset password form
	 * 
	 * @param {HTMLElement} target The target for the form
	 * @param {HTMLElement} messagesTarget The target for the messages
	 * @param {String} token The reset token of the user
	 * @param {String} info Information about the token
	 */
	displayResetPasswordForm: function(target, messagesTarget, token, info){

		//Create form container
		var formTarget = createElem2({
			appendTo: target,
			type: "div"
		});

		//Message
		add_p(formTarget, tr("Please enter now your new password."));

		//Prompt for new password
		const passwordInput = new PasswordInput(
			formTarget,
			tr("Your new password"),
			tr("Your new password")
		);
		passwordInput.setFirstName(info.first_name)
		passwordInput.setLastName(info.last_name)
		passwordInput.setEmail(info.mail)

		//Ask password confirmation
		var confirmPasswordInput = createFormGroup({
			target: formTarget,
			type: "password",
			label: "Confirm your password",
			placeholder: "Confirm your password"
		});

		//Submit button
		var submit = createElem2({
			appendTo: formTarget,
			type: "div",
			class: "btn btn-primary",
			innerHTML: "Submit"
		});

		//Make submit button lives
		submit.addEventListener("click", function(e){

			//Empty messages target
			emptyElem(messagesTarget);

			//Check password validity
			if(!passwordInput.isValid())
				return notify(tr("Please specify a valid password!"), "danger");
			
			//Check password confirmation
			if(passwordInput.value != confirmPasswordInput.value)
				return notify(tr("Password and its confirmation do not mach !"), "danger");
			
			submit.style.display = "none";

			//Send a request to the server
			ComunicWeb.components.account.interface.resetUserPassword(token, passwordInput.value, function(result){

				//Make submit button visible
				submit.style.display = "block";

				//Check for errors
				if(result.error){
					messagesTarget.appendChild(ComunicWeb.common.messages.createCalloutElem(
						tr("Error"),
						tr("The server rejected your request, please refresh the page and try again..."),
						"danger"
					));
					return;
				}

				//Success
				//Remove the form
				emptyElem(formTarget);

				//Success message
				messagesTarget.appendChild(ComunicWeb.common.messages.createCalloutElem(
					tr("Success"),
					tr("Your password has been successfully changed !"),
					"success"
				));

				//Add a button to go to login page
				var goLogin = createElem2({
					appendTo: formTarget,
					type: "div",
					class: "btn btn-primary",
					innerHTML: tr("Go login")
				});

				goLogin.addEventListener("click", function(e){
					openPage("login");
				});
			});

		});
	}
}