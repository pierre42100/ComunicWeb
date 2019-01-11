/**
 * Incognito mode management
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.incognito.management = {

	/**
	 * This variable is use to check if incognito mode
	 * has already be initialized or not
	 */
	_is_init: false,

	/**
	 * Specify whether incognito mode should be enabled or not
	 */
	_local_storage_name: "incognito_mode",

	/**
	 * Initialize incognito component
	 */
	init: function(){

		//This code should be run only once
		if(this._is_init)
			return;
		this._is_init = true;

		log("Initialize incognito mode");

		//Initialize components
		ComunicWeb.components.incognito.keyboard.init();
		ComunicWeb.components.incognito.ui.init();
	},

	/**
	 * Check out whether incognito mode is enabled or not
	 * 
	 * @return {Boolean} TRUE if incognito mode is enabled / FALSE else
	 */
	isEnabled: function(){
		return localStorage.getItem(this._local_storage_name) === "true";
	},

	/**
	 * Update status of incognito mode
	 * 
	 * @param {Boolean} enable TRUE to enable incognito mode / FALSE else
	 */
	setEnabled: function(enable){
		localStorage.setItem(this._local_storage_name, enable ? "true" : "false");

		//Propagate information
		SendEvent("incognitoStatusChanged", {
			enabled: enable
		});
	}
}