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
    }

};