/**
 * Settings interface
 * 
 * @author Pierre HUBERT
 */

const SettingsInterface = {

	/**
	 * Get general account settings
	 * 
	 * @param {function} callback
	 */
	getGeneral: function(callback){

		//Make a request over the API
		var apiURI = "settings/get_general";
		var params = {};
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);

	},

	/**
	 * Set (update) general account settings
	 * 
	 * @param {object} settings New general account settings
	 * @param {function} callback Callback function
	 */
	setGeneral: function(settings, callback){
		var apiURI = "settings/set_general";
		ComunicWeb.common.api.makeAPIrequest(apiURI, settings, true, callback);
	},

	/**
	 * Check the availability of the virtual directory for user
	 * 
	 * @param {string} directory The directory to check
	 * @param {function} callback
	 */
	checkUserDirectoryAvailability: function(directory, callback){
		var apiURI = "settings/check_user_directory_availability";
		var params = {
			directory: directory
		};
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);
	},

	/**
	 * Get language settings
	 * 
	 * @param {function} callback
	 */
	getLanguage: function(callback){
		//Make a request over the API
		var apiURI = "settings/get_language";
		var params = {};
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);
	},

	/**
	 * Set (update) language settinsg
	 * 
	 * @param {string} language The language to apply
	 * @param {function} callback
	 */
	setLanguage: function(language, callback){
		//Make a request over the API
		var apiURI = "settings/set_language";
		var params = {
			lang: language
		};
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);
	},

	/**
	 * Get security account settings
	 * 
	 * @param {string} password The password of the user
	 * @param {function} callback Callback function
	 */
	getSecurity: function(password, callback){
		var apiURI = "settings/get_security";
		var params = {
			password: password
		};
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);
	},

	/**
	 * Set (update) security account settings
	 * 
	 * @param {object} settings New settings
	 * @param {function} callback 
	 */
	setSecurity: function(settings, callback){
		var apiURI = "settings/set_security";
		ComunicWeb.common.api.makeAPIrequest(apiURI, settings, true, callback);
	},

	/**
	 * Update the password of the user
	 * 
	 * @param {string} oldPassword The old password of the user
	 * @param {string} newPassword The new password
	 * @param {function} callback
	 */
	updatePassword: function(oldPassword, newPassword, callback){
		var apiURI = "settings/update_password";
		var params = {
			oldPassword: oldPassword,
			newPassword: newPassword
		};
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);
	},

	/**
	 * Get account image settings from the API
	 * 
	 * @param {function} callback
	 */
	getAccountImage: function(callback){
		var apiURI = "settings/get_account_image";
		var params = {};
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);
	},

	/**
	 * Upload a new account image
	 * 
	 * @param {FormData} data The data containing information about the new account image
	 * @param {function} callback
	 */
	uploadAccountImage: function(data, callback){
		var apiURI = "settings/upload_account_image";
		ComunicWeb.common.api.makeFormDatarequest(apiURI, data, true, callback);
	},

	/**
	 * Delete current user account image
	 * 
	 * @param {function} callback
	 */
	deleteAccountImage: function(callback){
		var apiURI = "settings/delete_account_image";
		var params = {};
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);
	},

	/**
	 * Update the visibility of the account image
	 * 
	 * @param {string} visibility The new visibility level for the account image
	 * @param {function} callback
	 */
	updateAccountImageVisibility: function(visibility, callback){
		var apiURI = "settings/set_account_image_visibility";
		var params = {
			visibility: visibility
		};
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);
	},

	/**
	 * Upload a new custom emoji on the server
	 * 
	 * @param {FormData} form Associated form
	 */
	uploadEmoji: async function(form) {
		return new Promise((res, err) => {
			ComunicWeb.common.api.makeFormDatarequest("settings/upload_custom_emoji", form, true, (data) => {
				if(data.error)
					err(data.error);
				else
					res(data)
			})
		})
	},

	/**
	 * Delete a custom emoji
	 * 
	 * @param {Number} id The ID of the emoji to delete
	 */
	deleteEmoji: async function(id) {
		await api("settings/delete_custom_emoji", {
			emojiID: id
		}, true);
	},

	/**
	 * Get data conservation policy
	 * 
	 * @returns {Promise<DataConservationPolicy>}
	 */
	getDataConservationPolicy: async function() {
		return await api("settings/get_data_conservation_policy", null, true);
	},

	/**
	 * Update data conservation password
	 * 
	 * @param {DataConservationPolicy} policy New policy 
	 * @param {String} password User password
	 */
	setDataConservationPolicy: async function(policy, password) {
		let data = {
			password: password
		}

		for (let key in policy) {
			if (policy.hasOwnProperty(key))
				data[key] = policy[key]
		}

		await api("settings/set_data_conservation_policy", data, true)
	}
}

ComunicWeb.components.settings.interface = SettingsInterface;