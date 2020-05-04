/**
 * Global logout section
 * 
 * In this section, the user can choose to sign out
 * from all its devices
 * 
 * @author Pierre Hubert
 */

const GlobalSignOutSection = {
	/**
	 * Open settings section
	 * 
	 * @param {object} args Additionnal arguments
	 * @param {HTMLElement} target The target for the page
	 */
	open: function(args, target) {

		//Create a box
		var box = createElem2({
			appendTo: target,
			type: "div",
			class: "box box-primary box-global-logout"
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
			innerHTML: "Sign out from all devices"
		});

		//Create box body
		var boxBody = createElem2({
			appendTo: box,
			type: "div",
			class: "box-body",
			innerHTML: "<p>You can decide do sign out from all your connected devices (including the current one). You should do this if one of the devices you use to access Comunic is stolen.</p>"
		});

		const signoutButton = createElem2({
			appendTo: boxBody,
			type: "div",
			class: "btn btn-danger form-submit",
			innerHTML: "Sign out from all devices"
		})

		signoutButton.addEventListener("click",async (e) => {

			if(!await showConfirmDialog("Do you really want to get disconnected on all your devices?"))
				return;

			await AccountInterface.disconnectAllDevices();
		})
	}
}