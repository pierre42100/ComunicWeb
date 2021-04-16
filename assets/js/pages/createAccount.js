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
			innerHTML: lang("form_create_account_title")
		});

		//Add a message
		createElem2({
			appendTo: formRoot,
			type: "p",
			innerHTML: lang("form_create_account_intro")
		});

		//Create the message target
		var messagesTarget = createElem2({
			appendTo: formRoot,
			type: "div"
		});

		//Input user first name
		var firstNameInput = createFormGroup({
			target: formRoot,
			label: lang("form_create_account_first_name_label"),
			placeholder: lang("form_create_account_first_name_placeholder"),
			type: "text",
			maxLength: ServerConfig.conf.account_info_policy.max_first_name_length,
		});

		//Input user last name
		var lastNameInput = createFormGroup({
			target: formRoot,
			label: lang("form_create_account_last_name_label"),
			placeholder: lang("form_create_account_last_name_placeholder"),
			type: "text",
			maxLength: ServerConfig.conf.account_info_policy.max_last_name_length,
		});

		//Input user email
		var emailInput = createFormGroup({
			target: formRoot,
			label: lang("form_create_account_email_address_label"),
			placeholder: lang("form_create_account_email_address_placeholder"),
			type: "email"
		});

		// Input user password
		const passwordInput = new PasswordInput(formRoot, tr("Password"), tr("Your password"));
		emailInput.addEventListener("keyup", () => passwordInput.setEmail(emailInput.value))
		emailInput.addEventListener("change", () => passwordInput.setEmail(emailInput.value))

		firstNameInput.addEventListener("keyup", () => passwordInput.setFirstName(firstNameInput.value))
		firstNameInput.addEventListener("change", () => passwordInput.setFirstName(firstNameInput.value))

		lastNameInput.addEventListener("keyup", () => passwordInput.setLastName(lastNameInput.value))
		lastNameInput.addEventListener("change", () => passwordInput.setLastName(lastNameInput.value))

		//Confirm user password
		var confirmPasswordInput = createFormGroup({
			target: formRoot,
			label: lang("form_create_account_confirm_password_label"),
			placeholder: lang("form_create_account_confirm_password_placeholder"),
			type: "password"
		});

		//Terms of use must have been accepted
		var siteTerms = createFormGroup({
			target: formRoot,
			label: lang("form_create_account_terms_label", [ServerConfig.conf.terms_url]), 
			type: "checkbox"
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
			innerHTML: lang("form_create_account_submit")
		});

		//Add bottom links area
		var bottomLinks = createElem2({
			appendTo: formRoot,
			type: "div",
			class: "bottom-form-links"
		});

		//Create a link to redirect to the login page
		var loginLink = createElem2({
			appendTo: bottomLinks,
			type: "a",
			innerHTML: lang("form_create_account_login_with_existing")
		});
		loginLink.onclick = function(){
			openPage("login");
		}


		//Make the form lives
		submitButton.onclick = function(){

			//Empty the message target
			emptyElem(messagesTarget);

			//Check the terms of use have been accepted
			if(!siteTerms.checked)
				return notify(lang("form_create_account_err_need_accept_terms"), "danger");

			//Check the first name
			if(!FormChecker.checkInput(firstNameInput, true, ServerConfig.conf.account_info_policy.min_first_name_length))
				return notify(lang("form_create_account_err_need_first_name"), "danger");
			
			//Check the last name
			if(!FormChecker.checkInput(lastNameInput, true, ServerConfig.conf.account_info_policy.min_last_name_length))
				return notify(lang("form_create_account_err_check_last_name"), "danger");

			//Check the email address
			if(!FormChecker.checkInput(emailInput, true))
				return notify(lang("form_create_account_err_check_email_address"), "danger");
			
			//Check the password
			if(!passwordInput._valid)
				return notify(lang("form_create_account_err_check_password"), "danger");
			
			//Check the confirmation password
			if(passwordInput.value != confirmPasswordInput.value)
				return notify(lang("form_create_account_err_passwd_differents"), "danger");
			
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

						//Determine the right error to choose
						if(response.error.code == 409)
							var message = "form_create_account_err_existing_email";
						else if(response.error.code = 429)
							var message = "form_create_account_err_too_many_requests";
						else
							var message = "form_create_account_err_create_account_message";

						//Display an error
						messagesTarget.appendChild(ComunicWeb.common.messages.createCalloutElem(
							lang("form_create_account_err_create_account_title"),
							lang(message),
							"danger"
						));
						return;
					}

					//Redirect to the account created page
					openPage("account_created");
				}
			));
		};
	},
}