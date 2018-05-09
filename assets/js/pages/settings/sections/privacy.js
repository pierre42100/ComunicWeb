/**
 * Privacy settings section
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.pages.settings.sections.privacy = {

	/**
	 * Open settings section
	 * 
	 * @param {object} args Additionnal arguments
	 * @param {HTMLElement} target The target for the page
	 */
	open: function(args, target){

		//Delete account box
		this.showDeleteAccountBox(target);

	},
		
	/**
	 * Display delete account box
	 * 
	 * @param {HTMLElement} target The target for the box
	 */
	showDeleteAccountBox: function(target){

		//Create a box
		var box = createElem2({
			appendTo: target,
			type: "div",
			class: "box box-danger box-delete-account-settings"
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
			innerHTML: "Delete account"
		});

		//Create box body
		var boxBody = createElem2({
			appendTo: box,
			type: "div",
			class: "box-body"
		});

		//Add a notice
		createElem2({
			appendTo: boxBody,
			type: "p",
			innerHTML: "You can decide here to delete your account. <br /><b>Warning! Warning! Warning! This operation CAN NOT BE REVERTED !!!! All your data (post, conversation " +
				"messages, comments...) will be permanently deleted ! You will not be able to recover from this operation !</b>"
		});

		//Add delete account button
		var deleteAccountBtn = createElem2({
			appendTo: boxBody,
			type: "div",
			class: "btn btn-danger",
			innerHTML: "Delete your account"
		});

		deleteAccountBtn.addEventListener("click", function(e){

			//Request account deletion
			ComunicWeb.components.settings.helper.requestAccountDeletion();

		});
	},

}