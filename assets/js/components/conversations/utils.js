/**
 * Conversations utilites
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.conversations.utils = {

	/**
	 * Given conversation informations, returns its name
	 * 
	 * @param {Object} infos Conversation informations
	 * @param {Function} afterName What to do once we got conversation name
	 * @return {Boolean} True for a success
	 */
	getName: function(infos, afterName){

		//Check if the conversation has a name or not
		if(infos.name)
			afterName(infos.name);
		else {

			//Get informations about the first two members
			var firstMembers = [];

			//Retrieve IDs
			for(o in infos.members){
				//Limit number to 2
				if(firstMembers.length < 2){ 

					//Check this is a valid entry
					if(infos.members[o]){

						//Exclude current user ID
						if(infos.members[o] != userID()) 
							firstMembers.push(infos.members[o]);
					}
				}
			}

			//Get users informations
			ComunicWeb.user.userInfos.getNames(firstMembers, function(usersName){

				//For conversations with many members (more than 3 - we musn't forget current user)
				if(infos.members.length > 3)
					usersName += ", ...";

				//Peform next action now
				afterName(usersName);
			});
		}

		//Success
		return true;
	},

	/**
	 * Given a conversation ID, get its name
	 * 
	 * @param {number} id The ID of the target conversation
	 * @param {function} onGotName Function called once we have got the name of the conversation
	 */
	getNameForID: function(id, onGotName){

		ComunicWeb.components.conversations.interface.getInfosOne(id, function(info){

			//Check if an error occurred
			if(info.error)
				return onGotName(false);

			//Get and return the name of the conversation
			ComunicWeb.components.conversations.utils.getName(info, onGotName);
			
		});

	},

	/**
	 * Create and display a conversation creation / edition form
	 * 
	 * @param {HTMLElement} target The target of the creation form
	 * @return {Object} Informations about the form
	 */
	createConversationForm: function(target){

		//Create form object
		var form = {};

		//Create and display conversation creation form
		form.rootElem = createElem("div", target);

		//Choose users
		//Create select user element
		form.usersElement = createFormGroup({
			target: form.rootElem, 
			label: "Users", 
			multiple: true,
			placeholder: "Select users",
			type: "select2"});

		//Initialize user selector
		ComunicWeb.components.userSelect.init(form.usersElement);


		//Conversation name
		form.conversationNameInput = createFormGroup({
			target: form.rootElem, 
			label: "Conversation name", 
			placeholder: "Optionnal", 
			type: "text"});

		//Follow disucssion
		form.followConversationInput = createFormGroup({
			target: form.rootElem, 
			label: "Follow conversation", 
			checked: true,
			type: "checkbox"});

		//Create button
		form.createButton = createElem2({
			type: "button", 
			appendTo: form.rootElem,
			class: "btn btn-primary",
			innerHTML: "Create conversation"
		});
		form.createButton.style.width = "100%";

		//Return result
		return form;
	},
}