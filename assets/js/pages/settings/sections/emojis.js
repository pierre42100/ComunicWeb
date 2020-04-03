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

		this.RefreshList(emojiesList.querySelector("tbody"))
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

}