/**
 * Page settings
 * 
 * @author Pierre HUBERT
 */

const GroupSettingsPage = {

	/**
	 * Display page settings
	 * 
	 * @param {Number} id The ID of the target page
	 * @param {HTMLElement} target The target of the page
	 */
	display: async function(id, target){

		var root = createElem2({
			appendTo: target,
			type: "div",
			class: "row"
		})

		//Create settings container
		const settingsPage = createElem2({
			appendTo: root,
			type: "div",
			class: "group-settings-container col-md-6",
			innerHTML: "<div class='box box-primary'><div class='box-header'><h3 class='box-title'>"+tr("Group settings")+"</h3></div><div class='box-body'></div></di>"
		})
		
		const settingsBox = settingsPage.querySelector(".box-body");

		//Display loading message
		var loadingMsg = ComunicWeb.common.messages.createCalloutElem(
			tr("Loading"), 
			tr("Please wait while we retrieve the settings of the page..."),
			"info"
		);
		settingsBox.appendChild(loadingMsg);

		//Get the settings of the page
		const settings = await GroupsInterface.getSettings(id);

		loadingMsg.remove();

		ComunicWeb.common.pageTitle.setTitle(settings.name + " - Settings");

		//Create form container
		var formContainer = createElem2({
			appendTo: settingsBox,
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

		//Group URL
		var groupURL = createFormGroup({
			target: formContainer,
			type: "text",
			label: "Group URL",
			placeholder: "The URL of the group (optionnal)",
			value: settings.url == "null" ? "" : settings.url
		});


		//Group virtual directory
		var virtualDirectory = createFormGroup({
			target: formContainer,
			type: "text",
			label: "Virtual directory",
			placeholder: "Virtual directory of the group",
			value: settings.virtual_directory == "null" ? "" : settings.virtual_directory,
		});
		

		//Check virtual directory message target
		var checkVirtualDirectoryTarget = createElem2({
			appendTo: formContainer,
			type: "small"
		});

		virtualDirectory.onkeyup = function(){

			checkVirtualDirectoryTarget.innerHTML = "Checking availability...";

			//Get the directory to check
			var directory = virtualDirectory.value;

			//Check if the directory is empty
			if(directory == ""){
				checkVirtualDirectoryTarget.innerHTML = "";
				return;
			}

			//Perform a request on the API
			ComunicWeb.components.groups.interface.checkVirtualDirectory(directory, settings.id, function(callback){

				//Check if the directory is available or not
				checkVirtualDirectoryTarget.innerHTML = 
					callback.error
					? "<invalidDirectory>This directory is not available!</invalidDirectory>"
					: "This directory seems to be available!";

			})
		}


		//Group visibility
		var visibilityForm = createElem2({
			type: "form",
			appendTo: formContainer,
			class: "separated-block"
		});
		createElem2({
			appendTo: visibilityForm,
			type: "label",
			innerHTML: "Group visibility"
		});

		//Open
		createFormGroup({
			target: visibilityForm,
			label: "Open Group (accessible to everyone)",
			name: "group-visibility",
			type: "radio",
			value: "open",
			checked: settings.visibility == "open"
		});

		//Private
		createFormGroup({
			target: visibilityForm,
			label: "Private Group (accessible to accepted members only)",
			name: "group-visibility",
			type: "radio",
			value: "private",
			checked: settings.visibility == "private"
		});

		//Secret
		var secreteGroup = createFormGroup({
			target: visibilityForm,
			label: "Secrete Group (accessible only to invited members)",
			name: "group-visibility",
			type: "radio",
			value: "secrete",
			checked: settings.visibility == "secrete"
		});




		//Group registration levels
		var registrationLevelForm = createElem2({
			appendTo: formContainer,
			type: "form",
			class: "separated-block"
		});
		createElem2({
			appendTo: registrationLevelForm,
			type: "label",
			innerHTML: "Registration level"
		});

		//Open
		createFormGroup({
			target: registrationLevelForm,
			label: "Open registration (anyone can join the group as member)",
			name: "group-registration-level",
			type: "radio",
			value: "open",
			checked: settings.registration_level == "open"
		});

		//Moderated
		createFormGroup({
			target: registrationLevelForm,
			label: "Moderated registration (anyone can request a membership, but a moderator review the requests)",
			name: "group-registration-level",
			type: "radio",
			value: "moderated",
			checked: settings.registration_level == "moderated"
		});

		//Closed registration (required for secret groups)
		var closedRegistration = createFormGroup({
			target: registrationLevelForm,
			label: tr("Closed registration (the only way to join the group is to be invited by a moderator)"),
			name: "group-registration-level",
			type: "radio",
			value: "closed",
			checked: settings.registration_level == "closed"
		});

		//Make sure secret group have closed registration
		$(secreteGroup).on("ifChanged", function(){
			if(secreteGroup.checked){
				$(closedRegistration).iCheck("check");
			}
		});



		//Group posts level
		var postsLevelsForm = createElem2({
			appendTo: formContainer,
			type: "form",
			class: "separated-block"
		});
		createElem2({
			appendTo: postsLevelsForm,
			type: "label",
			innerHTML: "Posts creation level"
		});

		//Every members of the group
		createFormGroup({
			target: postsLevelsForm,
			label: "Every members of the posts can create posts",
			name: "group-posts-level",
			type: "radio",
			value: "members",
			checked: settings.posts_level == "members"
		});

		//Moderators only
		createFormGroup({
			target: postsLevelsForm,
			label: "Administrators and moderators only can create posts",
			name: "group-posts-level",
			type: "radio",
			value: "moderators",
			checked: settings.posts_level == "moderators"
		});


		// Make the list of members of the group public
		const isMembersListPublic = createFormGroup({
			target: postsLevelsForm,
			type: "checkbox",
			label: tr("Make the list of members of the group public"),
			checked: settings.is_members_list_public
		});





		//Group description
		var groupDescription = createFormGroup({
			target: formContainer,
			label: "Description of your group 255 characters max (optionnal)",
			type: "textarea",
			placeholder: "Description of your group...",
			value: settings.description != "null" ? settings.description : ""
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
			
			//Check the given group URL (if any)
			if(groupURL.value.length > 0){
				if(!check_url(groupURL.value))
					return notify("Please check the given URL !", "danger");
			}

			//Prepare the update request on the server
			var settings = {
				name: groupName.value,
				virtual_directory: virtualDirectory.value,
				visibility: visibilityForm.elements["group-visibility"].value,
				registration_level: registrationLevelForm.elements["group-registration-level"].value,
				posts_level: postsLevelsForm.elements["group-posts-level"].value,
				is_members_list_public: isMembersListPublic.checked,
				description: groupDescription.value,
				url: groupURL.value
			};

			//Lock the send button
			submitButton.disabled = true;

			//Perform the request on the API
			GroupsInterface.setSettings(id, settings, function(result){

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
		 * Group conversations
		 */
		const conversationsSettingsTPL = await Page.loadHTMLTemplate("pages/groups/sections/GroupConversationsSettings.html");
		const conversationsSettingsTarget = document.createElement("div")
		conversationsSettingsTarget.innerHTML = conversationsSettingsTPL
		settingsPage.appendChild(conversationsSettingsTarget)

		Vue.createApp({
			data: () => {
				return {
					conversations: settings.conversations,
					newConvName: "",
					newConvVisibility: "member"
				}
			},

			methods: {

				/**
				 * Create a new conversation
				 */
				createNewConv: async function() {
					try {
						const convName = this.newConvName;

						if (convName.length == 0)
							return notify(tr("Please give a name to new group conversations!"), "danger")

						await GroupsInterface.createGroupConversation(settings.id, convName, this.newConvVisibility)
						
						notify("The conversation was successfully created!", "success")

						Page.refresh_current_page();
					}
					
					catch(e) {
						console.error(e)
						notify(tr("Failed to create group conversation!"), "danger")
					}
				},

				/**
				 * Change conversation visibility
				 * 
				 * @param {Conversation} conv Information about the target conversation
				 */
				changeVisibility: async function (conv) {
					try {
						await GroupsInterface.changeGroupConversationVisibility(conv.id, conv.group_min_membership_level);
					}
					
					catch(e) {
						console.error(e)
						notify(tr("Failed to delete update conversation!"), "danger")
					}
				},

				/**
				 * Delete a conversation
				 */
				deleteConv: async function(convID) {
					try {
						if (!await showConfirmDialog("Do you really want to delete this conversation ?"))
							return;

						await GroupsInterface.deleteGroupConversation(convID)
						
						notify("The conversation was successfully deleted!", "success")

						Page.refresh_current_page();
					}
					
					catch(e) {
						console.error(e)
						notify(tr("Failed to delete group conversation!"), "danger")
					}
				}
			}
		}).mount(conversationsSettingsTarget);




		/**
		 * Group image
		 */
		const groupLogoSettingsContainer = createElem2({
			appendTo: settingsPage,
			type: "div",
			innerHTML: "<div class='box box-primary'><div class='box-header'><h3 class='box-title'>"+tr("Group logo")+"</h3></div><div class='box-body groupLogoSettingsContainer'></div></di>",
		}).querySelector(".box-body");


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




		/**
		 * Delete group link
		 */
		var deleteLinkContainer = createElem2({
			appendTo: formContainer,
			type: "div",
			class: "delete-group-link-container",
		});

		var deleteLink = createElem2({
			appendTo: deleteLinkContainer,
			type: "a",
			innerHTML: "Delete the group"
		});

		deleteLink.addEventListener("click", function(){
			ComunicWeb.pages.groups.pages.settings.confirm_delete_group(id);
		});
	},

	/**
	 * Confirm groups deletion
	 * 
	 * @param {number} groupID Target group ID
	 */
	confirm_delete_group: function(groupID){

		ComunicWeb.common.messages.confirm("Do you really want to delete this group? The operation can not be reverted!", function(r){

			if(!r) return;

			ComunicWeb.common.messages.promptPassword({callback: function(password){
				if(!password) return;

				ComunicWeb.components.groups.interface.deleteGroup(groupID, password, function(result){

					if(result.error)
						return notify("Could not delete the group! (maybe your password was incorrect...)", "danger");
					
					notify("The group was successfully deleted!", "success");
					openPage("groups");

				});
			}});

		});
		
	}
}

ComunicWeb.pages.groups.pages.settings = GroupSettingsPage;