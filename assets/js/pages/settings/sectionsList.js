/**
 * Settings pages list
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.pages.settings.sectionsList = {

	/**
	 * General settings
	 */
	general: {
		title: "General",
		handler: "ComunicWeb.pages.settings.sections.general.open",
	},

	/**
	 * Language settings
	 */
	language: {
		title: "Language",
		handler: "ComunicWeb.pages.settings.sections.language.open",
	},

	/**
	 * Custom emojies
	 */
	emojies: {
		title: "Custom emojis",
		handler: "EmojiesSection.Open"
	},

	/**
	 * Notifications
	 */
	notifications: {
		title: "Notifications",
		handler: "NotificationsSettings.Open"
	},

	/**
	 * Security settings
	 */
	security: {
		title: "Security",
		handler: "ComunicWeb.pages.settings.sections.security.open",
	},

	/**
	 * Password settings
	 */
	password: {
		title: "Password",
		handler: "ComunicWeb.pages.settings.sections.password.open",
	},

	/**
	 * Account image
	 */
	account_image: {
		title: "Account image",
		handler: "ComunicWeb.pages.settings.sections.accountImage.open"
	},

	/**
	 * Privacy settings
	 */
	privacy: {
		title: "Privacy",
		handler: "ComunicWeb.pages.settings.sections.privacy.open",
	},
}