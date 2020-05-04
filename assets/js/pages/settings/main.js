/**
 * User settings main script file
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.pages.settings.main = {

	/**
	 * Open settings page
	 * 
	 * @param {object} args Optionnal arguments
	 * @param {HTMLElement} target The target for the page
	 */
	open: function(args, target){

		if(!signed_in())
			openPage("login");

		//Settings page is organized like an array with two columns
		//Left column : settings sections menu
		//Rigth column : current settings section

		//Create a row
		var row = createElem2({
			appendTo: target,
			type: "div",
			class: "row settings-page-container"
		});

		//Left area
		var leftArea = createElem2({
			appendTo: row,
			type: "div",
			class: "col-md-3"
		});

		//Right area
		var rightArea = createElem2({
			appendTo: row,
			type: "div",
			class: "col-md-9"
		});

		//Display left navigation pane
		ComunicWeb.pages.settings.navigationPane.display(leftArea);

		//Determine which page to open
		var section = args.subfolder ? args.subfolder : "general";
		
		//Check if the section exists or not
		if(ComunicWeb.pages.settings.sectionsList[section]){
			
			//Extract section information
			var section = ComunicWeb.pages.settings.sectionsList[section];
			
			//Update document title
			ComunicWeb.common.pageTitle.setTitle("Settings - " + section.title);

			//Call handler
			eval(section.handler + "(args, rightArea);");

		}

		//The section is not found
		else {
			//Display error page (404)
			ComunicWeb.common.error.pageNotFound(args, target);
		}
	},

}