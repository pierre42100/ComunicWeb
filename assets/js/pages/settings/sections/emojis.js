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
					"<td>"+e.shorcut+"</td>" 
				


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

		
		const shorcutInput = createFormGroup({
			target: boxBody,
			label: "Shorcut (starting and ending with a semicolon)",
			placeholder: ":myEmoticon:",
			type: "text",
			name: "shorcut"
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
				const shorcut = shorcutInput.value
				if(!checkEmojiCode(shorcut)) {
					return notify("Invalid shorcut!", "danger");
				}

				if(associatedImage.files.length != 1) {
					return notify("Please specify a file to upload!", "danger")
				}

				const fd = new FormData()
				fd.append("shorcut", shorcut)
				fd.append("image", associatedImage.files[0])

				await ComunicWeb.components.settings.interface.uploadEmoji(fd)

				cb()

			} catch(e) {
				console.error(e);
				notify("Could not upload new emoji!", "danger");
			}
		})
	}
}