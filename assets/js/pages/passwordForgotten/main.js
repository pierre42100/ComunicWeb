/**
 * Password forgotten page main script file
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.pages.passwordForgotten.main = {

	/**
	 * Open page
	 * 
	 * @param {Object} args Additionnal data passed in the method
	 * @param {element} target Where the page will be applied
	 */
	open: function(args, target){

		//Create the main form box
		var box = createElem2({
			appendTo: target,
			type: "div",
			class: "box box-primary box-password-forgotten"
		});

		//Box head
		var boxHead = createElem2({
			appendTo: box,
			type: "div",
			class: "box-header"
		});
		
		//Add box title
		createElem2({
			appendTo: boxHead,
			type: "h3",
			class: "box-title",
			innerHTML: "Password forgotten"
		});

		//Put elements at the right of the head of the box
		var rightElems = createElem2({
			appendTo: boxHead,
			type: "div",
			class: "pull-right",
		});

			//Add cancel button
			var cancelButton = createElem2({
				appendTo: rightElems,
				type: "div",
				class: "btn btn-danger btn-xs btn-flat",
				innerHTML: "Cancel"
			});
			cancelButton.addEventListener("click", function(ev){
				openPage("home");
			});

		//Add box body
		var boxBody = createElem2({
			appendTo: box,
			type: "div",
			class: "box-body"
		});

		//Perform first step: ask user his email
		ComunicWeb.pages.passwordForgotten.promptEmail.open(boxBody, function(email){
			
			//Empty body
			emptyElem(boxBody);

			//Prompt user reset option
			ComunicWeb.pages.passwordForgotten.promptOption.open(email, boxBody, function(option){

				//Empty body
				emptyElem(boxBody);

				//Open appropriate page
				//Send an email
				if(option == "mail"){
					ComunicWeb.pages.passwordForgotten.mailAdmin.open(email, boxBody);
				}

				//Prompt security questions
				else if(option == "security_questions"){
					ComunicWeb.pages.passwordForgotten.promptSecurityQuestions.open(email, boxBody);
				}

				//Option not recognized
				else {
					boxBody.appendChild(ComunicWeb.common.messages.createCalloutElem(
						"Error", 
						"Option not found!", 
						"danger"));
				}
			});
		});
	},

}