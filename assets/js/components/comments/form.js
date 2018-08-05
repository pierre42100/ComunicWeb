/**
 * Comments form
 * 
 * @author Pierre HUBERT
 */
ComunicWeb.components.comments.form = {
	
	/**
	 * Display comments creation form
	 * 
	 * @param {number} postID The ID of the target post
	 * @param {HTMLElement} target The target for the form
	 */
	display: function(postID, target){
		
		//Check if we are creating a new comment of or reseting an existing one
		if(target.className != "comment-creation-form"){

			//Create form container
			var commentForm = createElem2({
				appendTo: target,
				type: "form",
				class: "comment-creation-form"
			});

		}
		else {

			//Reset current form
			emptyElem(target);
			var commentForm = target;

		}
		

		//Create input group
		var inputGroup = createElem2({
			appendTo: commentForm,
			type: "div",
			class: "input-group input-group-sm"
		});

		//Add text input
		var newCommentText = createElem2({
			appendTo: inputGroup,
			type: "input",
			elemType: "text",
			class: "form-control",
			placeholder: lang("comments_form_input_placeholder"),
			name: "content"
		});
		newCommentText.maxLength = 255;
		

		//Add button group
		var buttonsGroup = createElem2({
			appendTo: inputGroup,
			type: "span",
			class: "input-group-btn"
		});



		//Add emoji pick button
		var addEmojieLabel = createElem2({
			appendTo: buttonsGroup,
			type: "label",
			class: "comment-emoji-select"
		});

		var imageLabel = createElem2({
			appendTo: addEmojieLabel,
			type: "a",
			class: "btn btn-flat",
			innerHTML: "<i class='fa fa-smile-o'></i>"
		});

		//Add a picker on the label
		ComunicWeb.components.emoji.picker.addPicker(newCommentText, addEmojieLabel);



		//Add image pick button
		var addImageLabel = createElem2({
			appendTo: buttonsGroup,
			type: "label",
			class: "comment-image-select"
		});

		var imageFile = createElem2({
			appendTo: addImageLabel,
			type: "input",
			elemType: "file",
			name: "image"
		});

		var imageButton = createElem2({
			appendTo: addImageLabel,
			type: "a",
			class: "btn btn-flat",
			innerHTML: "<i class='fa fa-picture-o'></i>"
		});

		//Add send button
		var sendButton = createElem2({
			appendTo: buttonsGroup,
			type: "button",
			class: "btn btn-default btn-flat",
			innerHTML: lang("comments_form_send")
		});

		//Catch form when submitted
		commentForm.onsubmit = function(){

			//Check for image
			var hasImage = imageFile.files.length > 0;

			//Check the comment
			if(!hasImage && newCommentText.value < 5){
				ComunicWeb.common.notificationSystem.showNotification(lang("comments_form_err_invalid_comment"), "danger");
				return false;
			}

			//Lock send button
			sendButton.disabled = true;

			//Prepare the request
			var formData = new FormData();
			formData.append("content", newCommentText.value);

			//Check for image
			if(imageFile.files.length > 0)
				formData.append("image", imageFile.files[0], imageFile.files[0].name);

			//Send the request
			ComunicWeb.components.comments.interface.create(postID, formData, function(result){

				//Unlock send button
				sendButton.disabled = false;

				//Check for errors
				if(result.error){
					ComunicWeb.common.notificationSystem.showNotification(lang("comments_form_err_create_comment"), "danger");
					return;
				}

				//Reset the creation form
				ComunicWeb.components.comments.form.display(postID, commentForm);

				//Load the new comment before the form element
				var newCommentTarget = createElem2({
					insertBefore: commentForm,
					type: "div",
					class: "box-comment"
				});
				ComunicWeb.components.comments.actions.reload(result.commentID, newCommentTarget);
			});


			return false;
		}
	},

}