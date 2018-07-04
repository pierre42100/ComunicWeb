/**
 * Groups API interface
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.groups.interface = {

    /**
     * Create a group
     * 
     * @param {String} name The name of the group to create
     * @param {Function} callback
     */
    create: function(name, callback){

        //Perform a request over the API
        var apiURI = "groups/create";
        var params = {
            name: name
        };
        ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);
    },

    /**
     * Get information about a group
     * 
     * @param {Number} id The ID of the target group
     * @param {Function} callback Callback
     */
    getInfo: function(id, callback){
        //Perform the request over the API
        var apiURI = "groups/get_info";
        var params = {
            id: id
        };
        ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);
    },

    /**
     * Get advanced information about a group
     * 
     * @param {Number} id The ID of the target group
     * @param {Function} callback Callback
     */
    getAdvancedInfo: function(id, callback){
        //Perform the request over the API
        var apiURI = "groups/get_advanced_info";
        var params = {
            id: id
        };
        ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);
    },

    /**
     * Get the settings of a group
     * 
     * @param {Number} id The ID of the target group
     * @param {Function} callback
     */
    getSettings: function(id, callback){
        //Perform the request over the API
        var apiURI = "groups/get_settings";
        var params = {
            id: id
        };
        ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);
    },

    /**
     * Set (update) the settings of a group
     * 
     * @param {Number} id The ID of the target group
     * @param {Object} settings The new settings to apply to 
     * the group
     * @param {Function} callback
     */
    setSettings: function(id, settings, callback){
        //Perform the request over the API
        var apiURI = "groups/set_settings";
        settings.id = id;
        ComunicWeb.common.api.makeAPIrequest(apiURI, settings, true, callback);
    },

    /**
     * Upload a new group logo
     * 
     * @param {Number} id The ID of the target group
     * @param {FormData} data The form data that contains the
     * new logo (parameter name : logo)
     * @param {Function} callback
     */
    uploadLogo: function(id, data, callback){
        //Perform the request over the API
        var apiURI = "groups/upload_logo";
        data.append("id", id);
        ComunicWeb.common.api.makeFormDatarequest(apiURI, data, true, callback);
    }

};