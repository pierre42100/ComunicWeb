/**
 * Comunic bottom links list
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.bottom.links = [

	//Language selector
	{
		innerHTML: "<i class='fa fa-globe'></i> Language",
		onclick: function(){ComunicWeb.components.langPicker.show();}
	},

	//About Comunic
	{
		innerHTML: "<i class='fa fa-question-circle'></i> About",
		href: ComunicWeb.__config.aboutWebsiteURL,
		target: "_blank"
	}
];