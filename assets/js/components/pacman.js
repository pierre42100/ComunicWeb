/**
 * A little easter egg....
 * A pacman !
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.pacman = {

	/**
	 * Open pacman game
	 */
	open: function(){

		var dialog = ComunicWeb.common.messages.createDialogSkeleton({
			title: "Pacman game",
			type: "default"
		});
		$(dialog.modal).modal("show");

		//Create modal close function
		var closeModal = function(){
			$(dialog.modal).modal("hide");
		};
		dialog.cancelButton.addEventListener("click", closeModal);
		dialog.closeModal.addEventListener("click", closeModal);

		//This modal must be completely cleaned
		$(dialog.modal).on("hidden.bs.modal", function(){
			emptyElem(dialog.modal);
			dialog.modal.remove();
		});

		//Create iframe
		createElem2({
			appendTo: dialog.modalBody,
			type: "iframe",
			class: "pacman-iframe",
			src: ComunicWeb.__config.assetsURL + "3rdparty/pacman"
		});

		//Add a notice
		add_p(dialog.modalBody, "Please click on the pacman grid and press N to start a new game.");
	},

}