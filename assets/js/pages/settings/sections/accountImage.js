/**
 * Account image settings section
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.pages.settings.sections.accountImage = {

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
			class: "box box-primary box-account-image-settings"
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
			innerHTML: "Account image"
		});

		//Create box body
		var boxBody = createElem2({
			appendTo: box,
			type: "div",
			class: "box-body"
		});

		//Add loading callout
		var loadMsg = ComunicWeb.common.messages.createLoadingCallout(boxBody);
		
		//Fetch information about account image on the API
		ComunicWeb.components.settings.interface.getAccountImage(function(result){

			//Remove loading message
			loadMsg.remove();

			//Check for errors
			if(result.error){
				notify("Could not get account image information !", "danger");
				return;
			}

			//Display the form
			ComunicWeb.pages.settings.sections.accountImage._show_form(boxBody, result);
		});
	},

	/**
	 * Display account images form
	 * 
	 * @param {HTMLElement} target The target for the form
	 * @param {object} info Information about the form
	 */
	_show_form: function(target, info){

		//Apply account image settings
		var accountImageForm = createElem2({
			type: "div",
			appendTo: target
		});
		
		//First, offer the user to upload a new account image
		var newAccountImageLabel = createElem2({
			appendTo: accountImageForm,
			type: "label"
		});
		var fileInput = createElem2({
			appendTo: newAccountImageLabel,
			type: "input",
			elemType: "file"
		});
		fileInput.style.display = "none";
		var chooseButton = createElem2({
			appendTo: newAccountImageLabel,
			type: "div",
			class: "btn btn-primary",
			innerHTML: "Upload a new account image"
		});

		//Add event listener
		fileInput.addEventListener("change", function(e){
			
			//Check if no file have been selected
			if(fileInput.files.length == 0)
				return;

			//Upload the new file
			//Display a callout message
			var message = ComunicWeb.common.messages.createCalloutElem("", "Please wait while your picture is being uploaded...");
			target.insertBefore(message, accountImageForm);

			//Upload the image
			var fd = new FormData();
			fd.append("picture", fileInput.files[0], fileInput.files[0].name);
			ComunicWeb.components.settings.interface.uploadAccountImage(fd, function(result){

				//Remove message
				message.remove();

				//Check for errors
				if(result.error){
					notify("An error occured while trying to upload your image !", "danger");
					return;
				}

				notify("Your picture has been successfully uploaded !", "success");
				
				//Reload current page
				ComunicWeb.common.system.reset();
			});
		});

		//Stop here if the user does not have any account image
		if(!info.has_image)
			return;
		
		//Display user account image
		createElem2({
			appendTo: accountImageForm,
			type: "img",
			src: info.image_url,
			class: "settings-account-image-preview"
		});

		//Create actions contener
		var actionsContener = createElem2({
			appendTo: accountImageForm,
			type: "div"
		});

		//Delete account image
		var deleteImage = createElem2({
			appendTo: accountImageForm,
			type: "div",
			class: "btn btn-danger",
			innerHTML: "Delete image"
		});

		deleteImage.addEventListener("click", function(e){
			ComunicWeb.common.messages.confirm("Do you really want to delete your account image ? The operation can not be reverted !", function(res){

				if(!res)
					return;

				//Make a request on the server
				ComunicWeb.components.settings.interface.deleteAccountImage(function(callback){

					//Delay action to let the time to the page to restart
					setTimeout(function(){

						//Check for errors
						if(callback.error){
							notify("Could not delete your account image !", "danger");
						}
						else
							notify("Your account image has been successfully deleted!", "success");

					}, 500);
					
					
					//Reset the page
					ComunicWeb.common.system.reset();

				});

			});
		});
	}
}