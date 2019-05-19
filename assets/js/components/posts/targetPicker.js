/**
 * Posts target picker
 * 
 * @author Pierre HUBERT
 */

class SelectedPostTarget {
	constructor(user, group){
		/** @type {User} */
		this.user = user;

		/** @type {Group} */
		this.group = group
	}

	get isUser() {
		return this.user != null;
	}

	get isGroup() {
		return this.group != null;
	}
}

class PostTargetPicker {

	/**
	 * Show post target picker
	 * 
	 * @returns {Promise} Promise with information about the selected target
	 */
	static async show() {
		
		const dialog = ComunicWeb.common.messages.createDialogSkeleton({
			title: "Choose post destination",
		});
		$(dialog.modal).modal("show");

		const closeFunction = () => {
			$(dialog.modal).modal("hide");
			emptyElem(dialog.modal);
			dialog.modal.remove();
		};

		const loadErrorFunction = () => {
			closeFunction();
			notify("Could not get the list of possible targets !", "danger");
		}

		dialog.cancelButton.addEventListener("click", closeFunction);
		dialog.closeModal.addEventListener("click", closeFunction);

		//Show loading message
		const loadingMessage = 
			ComunicWeb.common.messages.createLoadingCallout(dialog.modalBody);

		// Get the list of posts
		const list = await ComunicWeb.components.posts.interface.getAvailableTargets().catch(e => {});

		loadingMessage.remove();

		// Check for errors
		if(!list)
			return loadErrorFunction();	

		//Get information about related users and groups
		const users = await getUsers(list.friends).catch(e => {});
		const groups = await getGroups(list.groups).catch(e => {});

		if(!users || !groups)
			return loadErrorFunction();

		// Display the list of option and wait for user response
		const result = await this._showResults(dialog.modalBody, list, users, groups);
		closeFunction();
		return result;
	}


	static _showResults(target, list, users, groups) {

		return new Promise((resolve, reject) => {
		
		// Apply the list of targets
		target.className += " posts-target-picker";

		// Friends
		createElem2({
			appendTo: target,
			type: "strong",
			class: "title",
			innerHTML: "Friends"
		});

		list.friends.forEach(id => {
			
			const user = users.get(id);

			createElem2({
				appendTo: target,
				type: "div",
				class: "friend-elem",
				children: [
					
					// Account image
					createElem2({
						type: "img",
						class: "img-circle user-image",
						src: user.image
					}),

					// User name
					createElem2({
						type: "span",
						innerHTML: user.fullName
					}),
				],
				onclick: (e) => resolve(new SelectedPostTarget(user, null))
			})

		});

		// Groups
		createElem2({
			appendTo: target,
			type: "strong",
			class: "title",
			innerHTML: "Groups"
		});

		list.groups.forEach(id => {
			
			const group = groups.get(id);

			createElem2({
				appendTo: target,
				type: "div",
				class: "group-elem",
				children: [
					
					// Account image
					createElem2({
						type: "img",
						class: "user-image",
						src: group.icon_url
					}),

					// User name
					createElem2({
						type: "span",
						innerHTML: group.name
					}),
				],
				onclick: (e) => resolve(new SelectedPostTarget(null, group))
			})

		});

	});
	}

}