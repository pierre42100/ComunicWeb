/**
 * Post editor
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.posts.edit = {

	/**
	 * Open post editor
	 * 
	 * @param {Object} infos Informations about the post to edit
	 * @param {HTMLElement} root Post root element
	 */
	open: function(infos, root){

		//Create editor modal
		var modal = createElem2({
			type: "div",
			class: "modal modal-default edit-post-modal"
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
		closeModalBtn.setAttribute("data-confirm", "false");
	
		createElem2({
			appendTo: closeModalBtn,
			type: "span",
			innerHTML: "x"
		});
	
		var modalTitle = createElem2({
			appendTo: modalHeader,
			type: "h4",
			class: "modal-title",
			innerHTML: lang("posts_edit_title")
		});
	
		//Modal body
		var modalBody = createElem2({
			appendTo: modalContent,
			type: "div",
			class: "modal-body",
		});
	
		//Modal footer
		var modalFooter = createElem2({
			appendTo: modalContent,
			type: "div",
			class: "modal-footer"
		});
	
		var cancelButton = createElem2({
			appendTo: modalFooter,
			type: "button",
			class: "btn btn-default pull-left",
			innerHTML: lang("posts_edit_cancel")
		});
		cancelButton.setAttribute("data-confirm", "false");
	
		var confirmButton = createElem2({
			appendTo: modalFooter,
			type: "button",
			class: "btn btn-primary",
			innerHTML: lang("posts_edit_update")
		});
		confirmButton.setAttribute("data-confirm", "true");

		//Show the modal
		$(modal).modal('show');

		//Create the update area
		var updateDiv = createElem2({
			appendTo: modalBody,
			type: "div",
			class: "editor-container"
		});

		//iOS fix : use slimscroll if required
		updateDiv.style.maxHeight = (window.innerHeight - 200) + "px";
		$(updateDiv).slimscroll({
			height: "100%"
		});

		//Create update editor
		var editorTextarea = createElem2({
			appendTo: updateDiv,
			type: "textarea",
			class: "editor",
			value: infos.content
		});
		
		sceditor.create(editorTextarea, {
			format: 'bbcode',
			height: "200px",
			width: "100%",
			icons: "material",
			style: ComunicWeb.components.posts.form.sceditor_stylsheet,
			toolbarExclude: "youtube,image,size,link,print,mail,emoticon,maximize"
		});

		//Create function to close modal
		var closeModal = function(){
			$(modal).modal('hide');
			emptyElem(modal);
			modal.remove();
		}

		//Handles update request
		var callback = function(){

			//Check if the update was cancelled
			if(this.getAttribute("data-confirm") !== "true"){
				closeModal();
				return; //Cancel operation
			}

			//Get the new post content
			var new_content = sceditor.instance(editorTextarea).getWysiwygEditorValue();

			//Check the new post content
			if(!ComunicWeb.components.posts.form._check_message(new_content)){
				ComunicWeb.common.notificationSystem.showNotification(lang("posts_edit_err_invalid_content"), "danger");
				return;
			}

			//Lock update button
			confirmButton.disabled = "true";

			//Perform a request on the API to update message content
			ComunicWeb.components.posts.interface.update_content(infos.ID, new_content, function(response){

				//Check for errors
				if(response.error){
					ComunicWeb.common.notificationSystem.showNotification(lang("posts_edit_err_update_content"), "danger");
					confirmButton.disabled = false;
					return;
				}

				//Display success
				ComunicWeb.common.notificationSystem.showNotification(lang("posts_edit_success_update"), "success");

				//Reload post
				ComunicWeb.components.posts.actions.reload_post(infos.ID, root);

				//Close the modal
				closeModal();

			});
		}
		closeModalBtn.onclick = callback;
		cancelButton.onclick = callback;
		confirmButton.onclick = callback;
	}

}