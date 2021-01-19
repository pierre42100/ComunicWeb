/**
 * Language section
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.pages.settings.sections.language = {
	/**
	 * Open settings section
	 * 
	 * @param {object} args Additionnal arguments
	 * @param {HTMLElement} target The target for the page
	 */
	open: function(args, target){
		
		//Create a box
		var box = createElem2({
			appendTo: target,
			type: "div",
			class: "box box-primary box-language-settings"
		});

		//Add box header
		var boxHead = createElem2({
			appendTo: box,
			type: "div",
			class: "box-header",
		});
		var boxTitle = createElem2({
			appendTo: boxHead,
			type: "h3",
			class: "box-title",
			innerHTML: "Language settings"
		});

		//Create box body
		var boxBody = createElem2({
			appendTo: box,
			type: "div",
			class: "box-body"
		});

		//Get language settings
		var loadingMessage = ComunicWeb.common.messages.createCalloutElem(
			"Loading", 
			"Please wait while we load language settings...", 
			"info");
		boxBody.appendChild(loadingMessage);

		ComunicWeb.components.settings.interface.getLanguage(function(result){

			loadingMessage.remove();

			if(result.error){
				boxBody.appendChild(ComunicWeb.common.messages.createCalloutElem(
					"Error", "Could not get language settings!", "danger"
				));
				return;
			}

			ComunicWeb.pages.settings.sections.language._show(boxBody, result);

		});
	},

	/**
	 * Display (show) language settings
	 * 
	 * @param {HTMLElement} target The target of the form
	 * @param {Object} settings Language settings
	 */
	_show: function(target, settings){

		//Create a form container
		var formContainer = createElem2({
			appendTo: target,
			type: "div"
		});

		//Add language choice
		var languageChooser = createFormGroup({
			target: formContainer,
			label: "Language",
			placeholder: "Application language",
			type: "select2"
		});

		//Parse list of langs
		for(language in ComunicWeb.common.langs.list){

			if(typeof language !== "string")
				continue;

			var info = ComunicWeb.common.langs.list[language];

			//Create the option
			var option = createElem2({
				appendTo: languageChooser,
				type: "option",
				value: language,
				innerHTML: info.local_name + " (" + info.name + ")"
			});

			if(language == ComunicWeb.common.langs.current())
				option.setAttribute("selected", "true");
			

		}

		//Add submit button
		var sendButton = createElem2({
			appendTo: formContainer,
			type: "div",
			class: "btn btn-primary submit-form",
			innerHTML: "Update settings"
		});

		//Make submit button lives
		sendButton.onclick = function(){

			//Get selected lang
			var language = languageChooser.value;

			//Perform a request over the server
			sendButton.style.visibility = "hidden";

			//Perform a request over the server
			ComunicWeb.components.settings.interface.setLanguage(language, function(result){

				sendButton.style.visibility = "visible";

				//Check for errors
				if(result.error){
					notify("An error occurred while trying to update language settings!", "danger");
					return;
				}

				//Success
				notify("Language settings has been successfully updated !");
				ComunicWeb.common.langs.setLang(language);

				//Refresh current page to apply new language settings
				ComunicWeb.common.system.reset();
			});
		}
	}

};