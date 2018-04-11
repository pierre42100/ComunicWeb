/**
 * Create account page
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.pages.createAccount = {

	/**
	 * Open create account page
	 * 
	 * @param {Object} additionnalData Additionnal data passed in the method
	 * @param {element} target Where the page will be applied
	 */
	openPage: function(additionnalData, target){

		//Display the account creation form
		this._display_form(target);

	},

	/**
	 * Display the account creation form
	 * 
	 * @param {HTMLElement} target The target for the page
	 */
	_display_form: function(target){

		//Create form root
		var formRoot = createElem2({
			appendTo: target,
			type: "div",
			class: "create-account-form"
		});

		//Add a title
		createElem2({
			appendTo: formRoot,
			type: "h2",
			innerHTML: "Create an account"
		});

		//Add a message
		createElem2({
			appendTo: formRoot,
			type: "p",
			innerHTML: "Use the following form to create an account and join the network : "
		});

		//Create the message target
		var messagesTarget = createElem2({
			appendTo: formRoot,
			type: "div"
		});

		//Input user first name
		var firstNameInput = createFormGroup({
			target: formRoot,
			label: "First name",
			placeholder: "Your first name",
			type: "text"
		});

		//Input user last name
		var lastNameInput = createFormGroup({
			target: formRoot,
			label: "Last name",
			placeholder: "Your last name",
			type: "text"
		});

		//Input user email
		var emailInput = createFormGroup({
			target: formRoot,
			label: "Email address <small><i class='fa fa-warning'></i> Warning! You will not be able to change this later !</small>",
			placeholder: "Your email address",
			type: "email"
		});

		//Input user password
		var passwordInput = createFormGroup({
			target: formRoot,
			label: "Password",
			placeholder: "Your password",
			type: "password"
		});

		//Confirm user password
		var confirmPasswordInput = createFormGroup({
			target: formRoot,
			label: "Confirm your password",
			placeholder: "Your password",
			type: "password"
		});

		//Submit form
		var submitButtonContainer = createElem2({
			appendTo: formRoot,
			type: "div",
			class: "submit-form"
		});
		var submitButton = createElem2({
			appendTo: submitButtonContainer,
			type: "button",
			class: "btn btn-primary",
			innerHTML: "Create the account"
		});

		//Make the form lives
		submitButton.onclick = function(){

			//Empty the message target
			emptyElem(messagesTarget);

			//Check the first name
			if(!ComunicWeb.common.formChecker.checkInput(firstNameInput, true))
				return notify("Please check your first name !", "danger");
			
			//Check the last name
			if(!ComunicWeb.common.formChecker.checkInput(lastNameInput, true))
				return notify("Please check your last name !", "danger");

			//Check the email address
			if(!ComunicWeb.common.formChecker.checkInput(emailInput, true))
				return notify("Please check your email address !", "danger");
			
			//Check the password
			if(!ComunicWeb.common.formChecker.checkInput(passwordInput, true))
				return notify("Please check your password !", "danger");
			
			//Check the confirmation password
			if(passwordInput.value != confirmPasswordInput.value)
				return notify("The two passwords are not the same !", "danger");
			
			//Lock create account button
			submitButton.disabled = true;
			
			//Try to create the account
			if(ComunicWeb.components.account.interface.createAccount(
				firstNameInput.value,
				lastNameInput.value,
				emailInput.value,
				passwordInput.value,
				function(response){

					//Unlock button
					submitButton.disabled = false;

					//Check for error
					if(response.error){
						//Display an error
						messagesTarget.appendChild(ComunicWeb.common.messages.createCalloutElem(
							"Account creation failed",
							"An error occured while trying to create your account. It is most likely to be a server error, or the given email address is already associated with an account.",
							"danger"
						));
						return;
					}
				}
			));
		};
	},
}