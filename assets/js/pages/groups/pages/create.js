/**
 * Create a group page
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.pages.groups.pages.create = {

	/**
	 * Open the page
	 * 
	 * @param {HTMLElement} target The target of the page
	 */
	open: function(target){
		
		//Update page title
		ComunicWeb.common.pageTitle.setTitle("Create a group");

		//Create page container
		var pageContainer = createElem2({
			appendTo: target,
			type: "div",
			class: "create-group-page"
		});

		//Form container
		var formContainer = createElem2({
			appendTo: pageContainer,
			type: "form",
		});

		//Form title
		createElem2({
			appendTo: formContainer,
			type: "h3",
			innerHTML: "Create a group"
		})

		//Group name input
		var nameInput = createFormGroup({
			target: formContainer,
			label: "Group name",
			placeholder: "The name of the group",
			type: "text"
		});

		//Add submit button
		var submitContainer = createElem2({
			appendTo: formContainer,
			type: "div",
			class: "submit-button-container"
		});
		var submitButton = createElem2({
			appendTo: submitContainer,
			type: "input",
			elemType: "submit",
			class: "btn btn-primary",
			value: "Create"
		});

		//Handle form submit
		formContainer.onsubmit = function(){

			//Check if a request is already pending
			if(submitButton.disabled)
				return;

			//Check user inputs
			if(!ComunicWeb.common.formChecker.checkInput(nameInput, true)){
				notify("Please specify the name of the group!", "danger");
				return false;	
			}

			var name = nameInput.value;

			//Check the length of the name of the group
			if(name.length < 4){
				notify("The name of the group is too short !", "danger");
				return false;
			}

			//Disable submit button
			submitButton.disabled = true;

			//Perform a request on the server to create the group
			ComunicWeb.components.groups.interface.create(name, function(res){

				//Enable submit button
				submitButton.disabled = false;

				//Check for errors
				if(res.error){
					return notify("An error occured while trying to create the group!", "danger");
				}

				//Redirect to the group page
				openPage("groups/" + res.id);

			});

			//Prevent default behavior
			return false;
		}

	}

};