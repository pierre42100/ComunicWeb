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

		ComunicWeb.components.bottom.links.forEach(function(link){

			var linkEl = createElem2({
				appendTo: leftElements,
				type: "a",
				href: link.href,
				innerHTML: link.innerHTML,
				innerLang: link.innerLang,
				innerHTMLprefix: "<i class='fa "+link.icon+"'></i> "
			});

			if(link.target)
				linkEl.setAttribute("target", link.target);
			
			if(link.onclick)
				linkEl.onclick = link.onclick;

			add_space(leftElements);
			add_space(leftElements);
		});
	}

}