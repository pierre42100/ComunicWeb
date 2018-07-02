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
    }

};