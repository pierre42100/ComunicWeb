/**
 * Settings helper
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.settings.helper = {

	/**
	 * Request user account deletion
	 */
	requestAccountDeletion: function(){

		//Prompt user confirmation
		ComunicWeb.common.messages.confirm("Do you really want to delete your account ? This operation can not be reverted !", function(r){

			//Check if the user cancelled the operation
			if(!r) return;

			//Prompt user password
			var dialog = ComunicWeb.common.messages.createDialogSkeleton({
				type: "danger",
				title: "Password required"
			});
			$(dialog.modal).modal("show");
			
			//Create modal close function
			var closeModal = function(){
				$(dialog.modal).modal("hide");
				emptyElem(dialog.modal);
				dialog.modal.remove();
			};
			dialog.cancelButton.addEventListener("click", closeModal);
			dialog.closeModal.addEventListener("click", closeModal);

			//Set dialog body
			var passwordForm = createElem2({
				appendTo: dialog.modalBody,
				type: "div"
			});

			createElem2({
				appendTo: passwordForm,
				type: "p",
				innerHTML: "We need your password to continue. Note: once you click 'Confirm', you will not be able to go back..."
			});

			//Create pasword input group
			var inputGroup = createElem2({
				appendTo: passwordForm,
				type: "div",
				class: "input-group input-group-sm"
			});

			//Create password input
			var passwordInput = createElem2({
				appendTo: inputGroup,
				type: "input",
				class: "form-control",
				elemType: "password"
			});

			//Create input group
			var inputGroupContainer = createElem2({
				appendTo: inputGroup,
				type: "span",
				class: "input-group-btn"
			});

			//Add submit button
			var submitButton = createElem2({
				appendTo: inputGroupContainer,
				type: "button",
				class: "btn btn-danger",
				innerHTML: "Confirm deletion"
			});

			submitButton.addEventListener("click", function(e){

				//Check given password
				var password = passwordInput.value;
				if(password.length < 4)
					return notify("Please check given password !", "danger");
				
				//Close modal
				closeModal();

				//Perform a request over the interface
				ComunicWeb.components.settings.helper.deleteAccount(password);
			});
		});

	},

	/**
	 * Delete the account of the user
	 * 
	 * @param {string} password The password of the account to delete
	 */
	deleteAccount: function(password){

		//Lock the screen with a loading splash screen
		var splashScreen = ComunicWeb.common.page.showTransparentWaitSplashScreen();

		//Perform the request over the interface
		ComunicWeb.components.account.interface.deleteAccount(password, function(result){

			//Remove loading splash screen
			splashScreen.remove();

			//Check for errors
			if(result.error)
				return notify("Could not delete your account (please check given password) !", "danger");
			
			//Restart the page in case of success
			ComunicWeb.common.system.restart();

		});

	},

}