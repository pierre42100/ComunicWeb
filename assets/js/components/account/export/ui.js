/**
 * Account export UI controller
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.account.export.ui = {

	/**
	 * Account export modal information
	 */
	
	_exportModal: {},

	/**
	 * Request account export
	 * 
	 * @param {String} password The password of the user
	 */
	requestExport: function(password){

		//Reset modal information
		this._exportModal = {};

		//Create the modal
		this._exportModal = ComunicWeb.common.messages.createDialogSkeleton({
			title: "Exporting data"
		});
		var modal = this._exportModal.modal;
		$(modal).modal("show");

		//Add message
		createElem2({
			appendTo: this._exportModal.modalBody,
			type: "p",
			innerHTML: "Please do not close this window while we create your archive..."
		});
		
		//Add progress bar
		var progressContainer = createElem2({
			appendTo: this._exportModal.modalBody,
			type: "div",
			class: "progress progress-xs progress-striped active"
		});
		this._exportModal.progress = createElem2({
			appendTo: progressContainer,
			type: "div",
			class: "progress-bar progress-bar-success"
		});
		this.updateProgress(1);

		//Add message
		this._exportModal.messageContainer = createElem2({
			appendTo: this._exportModal.modalBody,
			type: "p",
			innerHTML: "Starting..."
		});

		//Create close modal function
		var closeModal = function(){
			$(modal).modal('hide');
			emptyElem(modal);
			remove();
		}
		this._exportModal.close = closeModal;
		this._exportModal.closeModal.onclick = closeModal;
		this._exportModal.cancelButton.onclick =  closeModal;

		//Start the worker
		ComunicWeb.components.account.export.worker.start(password);
	},

	/**
	 * Update the progress of the creation of the archive
	 * 
	 * @param {Number} progress The new percentage to apply
	 */
	updateProgress: function(progress){
		this._exportModal.progress.style.width = progress + "%";
	},

	/**
	 * Update the message shown on the screen
	 * 
	 * @param {String} message The new message
	 */
	updateMessage: function(message){
		this._exportModal.messageContainer.innerHTML = message;
	},

	/**
	 * Display an error that prevent the success of the operation
	 * 
	 * @param {String} message The message of the error
	 */
	exportFatalError: function(message){

		//Get modal body
		var modalBody = this._exportModal.modalBody;
		emptyElem(modalBody);

		//Display the error message
		var msg = ComunicWeb.common.messages.createCalloutElem("Could not export your data", "An error occurred while trying to export your data: <i>" + message + "</i>", "danger");
		modalBody.appendChild(msg);
	}
}