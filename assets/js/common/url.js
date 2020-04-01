/**
 * URL functions
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.common.url = {
    /**
     * Return current URL opened on the website
     * 
     * @return {String} The URL opened on the website
     */
    getCurrentWebsiteURL: function(){
        //Retrieve website URL
        var websiteURL = location.href;
        
        //Extract the URI part for the app
        var uripage = websiteURL.replace(ComunicWeb.__config.siteURL, "");

        //Return result
        return uripage;
    },

    /**
	 * Change the current website URI
	 *
	 * @param {String} newTitle New title for the page
	 * @param {String} newURI The new URI
     * @return {Boolean} False if it fails
	 */
	changeURI: function(newTitle, newURI){

        //Determine the new URL
        var newURL = ComunicWeb.__config.siteURL + newURI;
        
        //Apply it
		window.history.pushState("object or string", newTitle, newURL);

        SendEvent("changeURI");

        //Everything is OK 
        return true;
	},
};