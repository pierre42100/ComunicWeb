/**
 * Prompt user email step
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.pages.passwordForgotten.promptEmail = {

	/**
	 * Prompt user email
	 * 
	 * @param {HTMLElement} target The target for the form
	 * @param {Function} callback Function to call once the user has entered
	 * his email
	 */
	open: function(target, callback){

		//Create the form
		var form = createElem2({
			appendTo: target,
			type: "form"
		});

		//Add message target
		var messageTarget = createElem2({
			appendTo: form,
			type: "div"
		});

		//Add field
		var input = createFormGroup({
			target: form,
			label: "Your email address",
			name: "email",
			placeholder: "Email address",
			type: "email"
		});

		//Add submit button
		var submit = createElem2({
			appendTo: form,
			type: "input",
			class: "btn btn-primary",
			elemType: "submit",
			value: "Submit"
		});

		//Create submit function
		var lock = false;
		var submit_form = function(){

			//Check if the function is locked
			if(lock)
				return;
			
			//Empty messages target
			emptyElem(messageTarget);

			//Check given email
			if(!ComunicWeb.common.formChecker.checkInput(input, true))
				return notify("Please specify a valid email address !", "danger");
			
			//Lock submit button
			lock = true;

			//Get the email
			var email = input.value;
			
			//Check whether the email is linked to an account or not
			ComunicWeb.components.account.interface.existsMail(input.value, function(result){

				//Unlock the form
				lock = false;

				//Check if the email is valid
				if(!result.exists){
					messageTarget.appendChild(ComunicWeb.common.messages.createCalloutElem("Error", "Specified email address not found !", "danger"));
					return;
				}

				//Else the email  exists
				emptyElem(form);
				form.remove();
				callback(email);
			});
		}

		//Catch form submission
		form.onsubmit = function(){
			submit_form();
			return false;
		}
	},

}