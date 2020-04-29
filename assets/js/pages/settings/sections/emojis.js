/**
 * Emojies settings sections
 * 
 * @author Pierre Hubert
 */

class EmojiesSection {


	static Open(args, target) {

		//Create a box
		const box = createElem2({
			appendTo: target,
			type: "div",
			class: "box box-primary box-emojis-settings"
		});

		//Add box header
		const boxHead = createElem2({
			appendTo: box,
			type: "div",
			class: "box-header",
		});
		const boxTitle = createElem2({
			appendTo: boxHead,
			type: "h3",
			class: "box-title",
			innerHTML: "Custom emojis settings"
		});

		//Create box body
		const boxBody = createElem2({
			appendTo: box,
			type: "div",
			class: "box-body"
		});
		
		const emojiesList = createElem2({
			appendTo: boxBody,
			type: "table",
			class: "table table-hover",
			innerHTML: "<tbody />"
		})

		const refreshFunction = () => this.RefreshList(emojiesList.querySelector("tbody"))
		refreshFunction();

		// Add create form
		this.AddUploadForm(target, refreshFunction)
	}

	/**
	 * @param {HTMLElement} target 
	 */
	static async RefreshList(target) {
		try {
			target.innerHTML = "";

			const emojies = (await userInfo(userID(), true)).customEmojis;

			if(emojies.length == 0) {
				target.innerHTML = "<tr><td>There is no custom emojis yet</td></tr>"
			}

			for(const e of emojies) {
				
				const line = createElem2({
					type: "tr",
					appendTo: target,
				})


				line.innerHTML += "<td><img class='e' src='"+e.url+"' /></td>" +
					"<td>"+e.shorcut+"</td><td></td>" 
				

				// Add delete button
				const deleteBtnTarget = line.querySelector("td:last-of-type")

				const deleteButtonLink = createElem2({
					appendTo: deleteBtnTarget,
					type: "a",
					innerHTML: "<i class='fa fa-trash'></i>"
				});
	
				deleteButtonLink.addEventListener("click", () => {

					ComunicWeb.common.messages.confirm("Do you really want to delete this emoji ?", async (confirm) => {
						if(!confirm)
							return;

						try {
							await SettingsInterface.deleteEmoji(e.id)
						
							this.RefreshList(target);
						} catch(e) {
							console.error(e);
							notify("Could not delete emoji!", "danger")
						}

					})

				})
			}

		} catch (error) {
			console.error(error)
			target.appendChild(ComunicWeb.common.messages.createCalloutElem(
				"Error",
				"Could not refresh the list of emojis!",
				"danger"
			))
		}
	}

	/**
	 * Add a form to upload new custom emojies
	 * 
	 * @param {HTMLElment} target The target for the form
	 * @param cb Callback function to call in case of success
	 */
	static AddUploadForm(target, cb) {

		//Create a box
		const box = createElem2({
			appendTo: target,
			type: "div",
			class: "box box-primary box-emojis-settings"
		});

		// Create the form
		const form = createElem2({
			appendTo: box,
			type: "form",
		});


		//Add box header
		const boxHead = createElem2({
			appendTo: form,
			type: "div",
			class: "box-header",
		});
		const boxTitle = createElem2({
			appendTo: boxHead,
			type: "h3",
			class: "box-title",
			innerHTML: "Add a new custom emoji"
		});

		//Create box body
		const boxBody = createElem2({
			appendTo: form,
			type: "div",
			class: "box-body"
		});

		
		const shortcutInput = createFormGroup({
			target: boxBody,
			label: "Shortcut (starting and ending with a semicolon)",
			placeholder: ":myEmoticon:",
			type: "text",
			name: "shortcut"
		})

		const associatedImage = createFormGroup({
			target: boxBody,
			label: "Associated image",
			type: "file"
		})


		// Create box footer
		const boxFooter = createElem2({
			appendTo: form,
			type: "div",
			class: "box-footer"
		})

		const submitButton = createElem2({
			appendTo: boxFooter,
			type: "input",
			elemType: "submit",
			value: "Upload custom emoji",
			class: "btn btn-primary"
		})


		form.addEventListener("submit", async (e) => {
			e.preventDefault();

			try {
				const shortcut = shortcutInput.value
				if(!checkEmojiCode(shortcut)) {
					return notify("Invalid shortcut!", "danger");
				}

				if(associatedImage.files.length != 1) {
					return notify("Please specify a file to upload!", "danger")
				}

				const fd = new FormData()
				fd.append("shortcut", shortcut)
				fd.append("image", associatedImage.files[0])

				await SettingsInterface.uploadEmoji(fd)

				cb()

				// Recreate form
				box.remove();
				this.AddUploadForm(target, cb);

			} catch(e) {
				console.error(e);
				notify("Could not upload new emoji!", "danger");
			}
		})
	}
}