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

			//Create form contener
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
			placeholder: "New comment...",
			name: "content"
		});
		

		//Add button group
		var buttonsGroup = createElem2({
			appendTo: inputGroup,
			type: "span",
			class: "input-group-btn"
		});

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
		})

		//Add send button
		var sendButton = createElem2({
			appendTo: buttonsGroup,
			type: "button",
			class: "btn btn-default btn-flat",
			innerHTML: "Send"
		});

		//Catch form when submitted
		commentForm.onsubmit = function(){

			//Check for image
			var hasImage = imageFile.files.length > 0;

			//Check the comment
			if(!hasImage && newCommentText.value < 5){
				ComunicWeb.common.notificationSystem.showNotification("Please type a valid comment! (at least 5 characters)", "danger");
				return false;
			}

			//Lock send button
			sendButton.disabled = true;

			//Try to create the comment
			var formData = new FormData(commentForm);
			ComunicWeb.components.comments.interface.create(postID, formData, function(result){

				//Unlock send button
				sendButton.disabled = false;

				//Check for errors
				if(result.error){
					ComunicWeb.common.notificationSystem.showNotification("Couldn't create comment! (check its content)", "danger");
					return;
				}

				//Reset the creation form
				ComunicWeb.components.comments.form.display(postID, commentForm);

				//Load the new comment before the form element
				var newCommentTarget = createElem2({
					insertBefore: commentForm,
					type: "div"
				});
				ComunicWeb.components.comments.actions.reload(result.commentID, newCommentTarget);
			});


			return false;
		}
	},

}