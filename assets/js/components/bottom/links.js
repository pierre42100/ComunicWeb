/**
 * Comunic bottom links list
 * 
 * @author Pierre HUBERT
 */

const BottomLinks = () => [

	//Language selector
	{
		innerLang: "bottom_bar_action_language",
		icon: "fa-globe",
		onclick: function(){ComunicWeb.components.langPicker.show();}
	},

	// Android application
	{
		innerHTML: tr("Android app"),
		icon: "fa-android",
		href: ServerConfig.conf.play_store_url,
		target: "_blank"
	},

	//About Comunic
	{
		innerLang: "bottom_bar_action_about",
		icon: "fa-question-circle",
		href: ComunicWeb.__config.aboutWebsiteURL,
		target: "_blank"
	}
];