/**
 * Page settings
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.pages.groups.pages.settings = {

	/**
	 * Open group settings page
	 * 
	 * @param {Number} id The ID of the settings page
	 * @param {HTMLElement} target The target of the page
	 */
	open: function(id, target){
		
		//Create settings container
		var settingsContainer = createElem2({
			appendTo: target,
			type: "div",
			class: "group-settings-container col-md-6"
		});

		//Add backward link
		var backwardLink = createElem2({
			appendTo: settingsContainer,
			type: "div",
			class: "a",
			innerHTML: "<i class='fa fa-arrow-left'></i> Go back to the group"
		});
		backwardLink.addEventListener("click", function(e){
			openPage("groups/" + id);
		});

		//Add title
		createElem2({
			appendTo: settingsContainer,
			type: "h2",
			class: "title",
			innerHTML: "Group settings"
		});

		//Display loading message
		var loadingMsg = ComunicWeb.common.messages.createCalloutElem(
			"Loading", 
			"Please wait while we retrieve the settings of the page...", 
			"info");
		settingsContainer.appendChild(loadingMsg);
		
		//Get the settings of the page
		ComunicWeb.components.groups.interface.getSettings(id, function(result){

			//Remove loading message
			loadingMsg.remove();

			//Check for error
			if(result.error){
				
				//Check if the user is not authorized to access the page
				if(result.error.code == 401){
					//The user is not authorized to see this page
					settingsContainer.appendChild(ComunicWeb.common.messages.createCalloutElem(
						"Access forbidden",
						"You are not authorized to access these information !",
						"danger"
					));
				}

				//Else the page was not found
				else {
					settingsContainer.remove();
					ComunicWeb.common.error.pageNotFound({}, target);
				}

			}

			else {
				//Display settings pages
				ComunicWeb.pages.groups.pages.settings.display(id, result, settingsContainer);
			}

		});

	},

	/**
	 * Display page settings
	 * 
	 * @param {Number} id The ID of the target page
	 * @param {Object} settings The settings of the page
	 * @param {HTMLElement} target The target of the page
	 */
	display: function(id, settings, target){

		//Create form container
		var formContainer = createElem2({
			appendTo: target,
			type: "div",
			class: "group-settings-form"
		});

		//Group ID (not editable)
		createFormGroup({
			target: formContainer,
			label: "Group ID",
			type: "text",
			value: settings.id,
			disabled: true
		});

		//Group name
		var groupName = createFormGroup({
			target: formContainer,
			type: "text",
			label: "Group name",
			placeholder: "The name of the group",
			value: settings.name,
		});

		//Submit button
		var submitButtonContainer = createElem2({
			appendTo: formContainer,
			type: "div",
			class: "submit-button-container"
		});
		var submitButton = createElem2({
			appendTo: submitButtonContainer,
			type: "div",
			class: "btn btn-primary",
			innerHTML: "Submit"
		});

		submitButton.addEventListener("click", function(e){

			//Check if another request is already pending or not
			if(submitButton.disabled)
				return;

			//Validate the form
			if(!ComunicWeb.common.formChecker.checkInput(groupName, true))
				return;
			
			//Check the length of the name of the group
			if(groupName.value.length < 4)
				return notify("Please check the name of group !", "danger");

			//Prepare the update request on the server
			var settings = {
				name: groupName.value
			};

			//Lock the send button
			submitButton.disabled = true;

			//Perform the request on the API
			ComunicWeb.components.groups.interface.setSettings(id, settings, function(result){

				//Unlock send button
				submitButton.disabled = false;

				//Check for errors
				if(result.error)
					return notify("An error occured while trying to update group settings!", "danger");
				else
					return notify("Group settings have been successfully updated!", "success");

			});
		});


		/**
		 * Group account image
		 */
		var groupLogoSettingsContainer = createElem2({
			appendTo: formContainer,
			type: "div",
			class: "groupLogoSettingsContainer"
		});

		createElem2({
			appendTo: groupLogoSettingsContainer,
			type: "h3",
			class: "title",
			innerHTML: "Group logo"
		});

		//Display group logo (img)
		var groupLogo = createElem2({
			appendTo: groupLogoSettingsContainer,
			type: "img",
			class: "group-logo-settings-img",
			src: settings.icon_url
		});


		//Add a button to update the group logo
		var updateGroupLogoLabel = createElem2({
			appendTo: groupLogoSettingsContainer,
			type: "label",
		});

		var updateLogoInput = createElem2({
			appendTo: updateGroupLogoLabel,
			type: "input",
			elemType: "file",
		});
		updateLogoInput.style.display = "none";

		var updateLogoBtn = createElem2({
			appendTo: updateGroupLogoLabel,
			type: "div",
			class: "btn btn-sm btn-primary",
			innerHTML: "Upload a new logo"
		});

		updateLogoInput.addEventListener("change", function(e){
			
			//Check if a file has been selected
			if(updateLogoInput.files.length == 0)
				return;

			//Upload the new group logo
			var fd = new FormData();
			fd.append("logo", updateLogoInput.files[0], updateLogoInput.files[0].name);
			ComunicWeb.components.groups.interface.uploadLogo(id, fd, function(result){

				//Check for errors
				if(result.error)
					return notify("An error occurred while trying to upload new group logo!", "danger");
				
				//Success
				notify("The new group logo has been successfully saved!", "success");

				//Change logo image
				groupLogo.src = result.url;

			});

		});


		//Add a button to apply a random generated logo
		add_space(groupLogoSettingsContainer);
		var generateRandomLogo = createElem2({
			appendTo: groupLogoSettingsContainer,
			type: "div",
			class: "btn btn-sm btn-success",
			innerHTML: "Generate random"
		});
		generateRandomLogo.addEventListener("click", function(e){

			//Lock screen
			message = ComunicWeb.common.page.showTransparentWaitSplashScreen();

			//Generate image
			var base64 = generateIdentImage();

			//Upload image
			var fd = new FormData();
			fd.append("logo", dataURItoBlob("data:image/png;base64," + base64));
			ComunicWeb.components.groups.interface.uploadLogo(id, fd, function(result){

				//Remove message
				message.remove();

				//Check for errors
				if(result.error){
					notify("An error occured while trying to upload generated logo !", "danger");
					return;
				}

				notify("Random generated logo has been uploaded !", "success");
				groupLogo.src = result.url;
				
			});

		});

		//Add a button to delete the group logo
		add_space(groupLogoSettingsContainer);
		var deleteLogoBtn = createElem2({
			appendTo: groupLogoSettingsContainer,
			type: "div",
			class: "btn btn-sm btn-danger",
			innerHTML: "Delete logo"
		});
		deleteLogoBtn.addEventListener("click", function(e){

			//Ask user confirmation
			ComunicWeb.common.messages.confirm("Do you really want to delete group logo ? This operation can not be reverted !", function(c){

				//Check if the user rejected the request
				if(!c) return;

				//Forward the request on the server
				ComunicWeb.components.groups.interface.deleteLogo(id, function(result){

					//Check for errors
					if(result.error)
						return notify("An error occurred while trying to delete group logo!", "danger");
					
					//Success
					notify("The group logo has been successfully deleted!", "success");

					//Apply new group logo
					groupLogo.src = result.url;

				});


			});

		});
	},
}