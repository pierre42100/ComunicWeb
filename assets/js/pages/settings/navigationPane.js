/**
 * Settings navigation pane
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.pages.settings.navigationPane = {

	/**
	 * Display the settings navigation pane
	 * 
	 * @param {HTMLElement} target The target for the navigation pane
	 */
	display: function(target){

		//Create a box
		var navigationBox = createElem2({
			appendTo: target,
			type: "div",
			class: "box box-solid"
		});

		//Set box header
		var boxHeader = createElem2({
			appendTo: navigationBox, 
			type: "div",
			class: "box-header with-border",
			
		});

		//Set box title
		createElem2({
			appendTo: boxHeader,
			type: "h3",
			class: "box-title",
			innerHTML: "Sections"
		});

		//Create box body
		var boxBody = createElem2({
			appendTo: navigationBox,
			type: "div",
			class: "box-body no-padding"
		});

		//Display the list of sections
		var elemList = createElem2({
			appendTo: boxBody,
			type: "ul",
			class: "nav nav-pills nav-stacked"
		});

		//General account information
		var sectionGeneral = createElem2({
			appendTo: elemList,
			type: "li",
		});
		var sectionGeneralLink = createElem2({
			appendTo: sectionGeneral,
			type: "a",
			innerHTML: "<i class='fa fa-user'></i> General"
		});
		sectionGeneralLink.onclick = function(){
			openPage("settings/general");
		};

		//Account language settings
		var sectionLanguage = createElem2({
			appendTo: elemList,
			type: "li",
		});
		var sectionLanguageLink = createElem2({
			appendTo: sectionLanguage,
			type: "a",
			innerHTML: "<i class='fa fa-flag'></i> Language"
		});
		sectionLanguageLink.onclick = function(){
			openPage("settings/language");
		};

		//Account security
		var sectionSecurity = createElem2({
			appendTo: elemList,
			type: "li",
		});
		var sectionSecurityLink = createElem2({
			appendTo: sectionSecurity,
			type: "a",
			innerHTML: "<i class='fa fa-lock'></i> Security"
		});
		sectionSecurityLink.onclick = function(){
			openPage("settings/security");
		};

		//Account image
		var sectionSecurity = createElem2({
			appendTo: elemList,
			type: "li",
		});
		var sectionSecurityLink = createElem2({
			appendTo: sectionSecurity,
			type: "a",
			innerHTML: "<i class='fa fa-file-image-o'></i> Account image"
		});
		sectionSecurityLink.onclick = function(){
			openPage("settings/account_image");
		};

		//Privacy settings
		var sectionSecurity = createElem2({
			appendTo: elemList,
			type: "li",
		});
		var sectionSecurityLink = createElem2({
			appendTo: sectionSecurity,
			type: "a",
			innerHTML: "<i class='fa fa-user-secret'></i> Privacy"
		});
		sectionSecurityLink.addEventListener("click", function(){
			openPage("settings/privacy");
		});
	}

}