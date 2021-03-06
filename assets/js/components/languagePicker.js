/**
 * Language picker
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.langPicker = {

	/**
	 * Show the language picker
	 */
	show: function(){
		
		//Create a modal root
		var modal = createElem2({
			type: "div",
			class: "modal modal-primary pick-language-modal"
		});
	
		var modalDialog = createElem2({
			appendTo: modal,
			type: "div",
			class: "modal-dialog"
		});
	
		var modalContent = createElem2({
			appendTo: modalDialog,
			type: "div",
			class: "modal-content",
		});
	
		//Modal header
		var modalHeader = createElem2({
			appendTo: modalContent,
			type: "div",
			class: "modal-header"
		});
	
		var closeModalBtn = createElem2({
			appendTo: modalHeader,
			type: "button",
			class: "close",
		});
	
		createElem2({
			appendTo: closeModalBtn,
			type: "span",
			innerHTML: "x"
		});
	
		var modalTitle = createElem2({
			appendTo: modalHeader,
			type: "h4",
			class: "modal-title",
			innerHTML: "Change the language"
		});
	
		//Modal body
		var modalBody = createElem2({
			appendTo: modalContent,
			type: "div",
			class: "modal-body",
		});
	
		//Display the list of language
		var buttons = [];
		for(language in ComunicWeb.common.langs.list){

			if(typeof language !== "string")
				continue;
			
			var info = ComunicWeb.common.langs.list[language];

			const button = createElem2({
				appendTo: modalBody,
				type: "div",
				class: "btn btn-default",
				innerHTML: info.local_name + " (" + info.name + ")"
			});
			button.setAttribute("data-lang", language);
			buttons.push(button);

			add_space(modalBody);

		};
	
		//Modal footer
		var modalFooter = createElem2({
			appendTo: modalContent,
			type: "div",
			class: "modal-footer"
		});
	
		var cancelButton = createElem2({
			appendTo: modalFooter,
			type: "button",
			class: "btn btn-default",
			innerHTML: "Cancel"
		});
	
	
		var closeModal = function(){
			//Close modal
			$(modal).modal('hide');
			emptyElem(modal);
			modal.remove();
		}

		//Create the response function
		var respond = function(){
	
			//Close the modal
			closeModal();
			
			//Set the language
			var lang = this.getAttribute("data-lang");
			ComunicWeb.common.langs.setLang(lang);

			//Save settings in user account if signed in
			if(signed_in())
				ComunicWeb.components.settings.interface.setLanguage(lang);

			//Restart the app
			ComunicWeb.common.system.reset();
		}
		buttons.forEach(function(btn){btn.onclick  = respond;});
	
		//Make the buttons live
		cancelButton.onclick = closeModal;
		closeModalBtn.onclick = closeModal;
	
		//Show the modal
		$(modal).modal('show');

	}

}