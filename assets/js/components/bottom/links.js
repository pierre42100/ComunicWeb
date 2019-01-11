/**
 * Comunic bottom links list
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.bottom.links = [

	//Language selector
	{
		innerLang: "bottom_bar_action_language",
		icon: "fa-globe",
		onclick: function(){ComunicWeb.components.langPicker.show();}
	},

	//About Comunic
	{
		innerLang: "bottom_bar_action_about",
		icon: "fa-question-circle",
		href: ComunicWeb.__config.aboutWebsiteURL,
		target: "_blank"
	}
];