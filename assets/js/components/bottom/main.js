/**
 * Main bottom script file
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.bottom.main = {

	/**
	 * Display the footer of the pages
	 */
	display: function(){

		ComunicWeb.debug.logMessage("Display bottom page.");
		
		//Check if the footer is already shown or not
		var footer = byId("footer");

		if(footer){
			ComunicWeb.debug.logMessage("Notice : The footer is already shown on the screen !");
			return;
		}

		//Create and apply footer
		footer = createElem2({
			type: "footer",
			appendTo: byId("wrapper"),
			id: "footer",
			class: "main-footer"
		});

		//Add right element
		/*var rightElements = createElem2({
			appendTo: footer,
			type: "div",
			class: "pull-right"
		});*/

		//Left elements
		var leftElements = createElem2({
			appendTo: footer,
			type: "span",
			innerHTML: "Comunic &nbsp; &nbsp; "
		});

		//Put the language selector link on the right
		var langLink = createElem2({
			appendTo: leftElements,
			type: "a",
			innerHTML: "<i class='fa fa-globe'></i> Language"
		});
		langLink.onclick = function(){
			ComunicWeb.components.langPicker.show();
		};

		add_space(leftElements);
		add_space(leftElements);

		//Add about link
		var aboutLink = createElem2({
			appendTo: leftElements,
			type: "a",
			innerHTML: "<i class='fa fa-question-circle'></i> About",
			href: ComunicWeb.__config.aboutWebsiteURL
		});
		aboutLink.setAttribute("target", "_blank");
	}

}