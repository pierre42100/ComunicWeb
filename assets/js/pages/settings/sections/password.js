/**
 * Password update section
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.pages.settings.sections.password = {

	/**
	 * Open settings section
	 * 
	 * @param {object} args Additionnal arguments
	 * @param {HTMLElement} target The target for the page
	 */
	open: function(args, target){
		
		//Create a box
		var box = createElem2({
			appendTo: target,
			type: "div",
			class: "box box-primary box-password-settings"
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
			innerHTML: "Password update"
		});

		//Create box body
		var boxBody = createElem2({
			appendTo: box,
			type: "div",
			class: "box-body"
		});

		//Create a form contener
		var formContener = createElem2({
			appendTo: boxBody,
			type: "div"
		});

		//Ask the user to enter its old password
		var oldPasswordInput = createFormGroup({
			target: formContener,
			label: "Old password",
			placeholder: "Your old (current) password",
			type: "password"
		});

		// Ask the user to enter its new password
		var newPasswordInput = new PasswordInput(
			formContener,
			tr("New password"),
			tr("Your new password")
		);
		(async () => {
			let user = await userInfo(userID());
			newPasswordInput.setUser(user)
		})();

		//Ask the user to confirm its new password
		var confirmNewPasswordInput = createFormGroup({
			target: formContener,
			label: "Confirm your password",
			placeholder: "Your new password",
			type: "password"
		});

		//Add submit button
		var sendButton = createElem2({
			appendTo: formContener,
			type: "div",
			class: "btn btn-primary submit-form",
			innerHTML: "Update password"
		});

		//Make submit button lives
		sendButton.onclick = function(){

			//Check the old and the new password
			if(!ComunicWeb.common.formChecker.checkInput(oldPasswordInput, true)){
				notify(tr("Please specify your old password to update your password!"), "danger");
				return;
			}

			if(!newPasswordInput.isValid()){
				notify(tr("Please specify a new password to update your password!"), "danger");
				return;
			}

			//Check if the old and the new password are the same or not
			if(newPasswordInput.value !== confirmNewPasswordInput.value){
				notify(tr("The new password and its confirmation are not the same!"), "danger");
				return;
			}

			//Perform a request over the server
			sendButton.style.visibility = "hidden";

			//Perform a request over the server
			ComunicWeb.components.settings.interface.updatePassword(oldPasswordInput.value, newPasswordInput.value, function(result){

				sendButton.style.visibility = "visible";

				//Check for errors
				if(result.error){
					notify(tr("An error occurred while trying to update user password!"), "danger");
					return;
				}

				//Success
				notify(tr("Your password has been successfully updated !"));

				//Refresh current page to remove passwords (security)
				ComunicWeb.common.page.refresh_current_page();
			});
		}
	}

};