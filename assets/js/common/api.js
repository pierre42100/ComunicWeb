/**
 * API main functions
 * 
 * @author Pierre HUBERT
 */
const APIClient = {

    /**
     * Make an asynchronous request over the API
     * 
     * @returns {Promise}
     */
    exec:  function(apiURI, args, withLogin){

        if(!args)
            args = {};

        return new Promise((resolve, reject) => {

            this.makeAPIrequest(apiURI, args, withLogin, result => {
            
                if(result.error)
                    reject(result.error);
            
                else
                    resolve(result);

            });
        });
    },

    /**
     * Make an API request
     * 
     * @param {String} apiURI The URI to call in the API
     * @param {Object} params The params to include in request
     * @param {Boolean} requireLoginTokens Specify if login tokens are required or not
     * @param {Function} nextAction What to do next
     */
    makeAPIrequest: function(apiURI, params, requireLoginTokens, nextAction){
        //Prepare the request URL
        var requestURL = ComunicWeb.__config.apiURL + apiURI;
        
        // Add client name
        params.client = ComunicWeb.__config.apiClientName;

        //Add login tokens to params if required
        if(requireLoginTokens){
            params.token = LoginTokens.getLoginToken();
        }

        //Enable incognito mode if required
        if(ComunicWeb.components.incognito.management.isEnabled())
            params.incognito = true;

        //Prepare data to send in request
        var count = 0;
        var datas = "";
        for(paramName in params){
            //We add a "&" if it isn't the first param
            if(count != 0)
                datas += "&";

            //We add field value
            datas += encodeURIComponent(paramName) + "=" + encodeURIComponent(params[paramName]);

            count++; //Increment counter
        }     

        //Create request
        var apiXHR = new XMLHttpRequest();
        apiXHR.open("POST", requestURL);

        //Prepare request response
        apiXHR.onreadystatechange = function(){
            ComunicWeb.common.api._on_state_change(requestURL, apiXHR, nextAction);
        }

        //Set request headers
        apiXHR.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        //Submit request
        apiXHR.send(datas);
    },

    /**
     * Make an API request with a prepared form data object
     * 
     * @param {String} apiURI The URI to call in the API
     * @param {FormData} data The form data object
     * @param {Boolean} requireLoginTokens Specify if login tokens are required or not
     * @param {Function} nextAction What to do next
     */
    makeFormDatarequest: function(apiURI, data, requireLoginTokens, nextAction){
        //Prepare the request URL
        var requestURL = ComunicWeb.__config.apiURL + apiURI;
        
        // Add API client name
        data.append('client', ComunicWeb.__config.apiClientName);

        //Add login tokens to params if required
        if(requireLoginTokens){
            data.append("token", LoginTokens.getLoginToken())
        }
        
        //Enable incognito mode if required
        if(ComunicWeb.components.incognito.management.isEnabled())
            data.append("incognito", true);

        //Create request
        var apiXHR = new XMLHttpRequest();
        apiXHR.open("POST", requestURL);

        //Prepare request response
        apiXHR.onreadystatechange = function(){
            ComunicWeb.common.api._on_state_change(requestURL, apiXHR, nextAction);
        }

        //Submit request
        apiXHR.send(data);
    },

    /**
     * Handle xhr request chnages
     * 
     * @param {string} requestURL The URL of the request
     * @param {XMLHttpRequest} apiXHR The request element
     * @param {Function} nextAction What to do once the request is done
     */
    _on_state_change: function(requestURL, apiXHR, nextAction){

        //We continue only if request is terminated
        if(apiXHR.readyState == 4){

            //Check if response code is 0
            ComunicWeb.common.network.setStatus(apiXHR.status != 0);

            //Check if response is empty
            if(apiXHR.responseText.length == ""){
                //Auto-create a response for empty responses (to avoid Javascript errors and allow the script to continue to execute)
                result = {
                    error : {
                        code: 0,
                        message: "Empty response",
                    },
                };
            }
            else {

                //Catch JSON parsing errors
                try {

                    //Parse result
                    var result = JSON.parse(apiXHR.responseText);

                } catch (error) {
                    
                    //Report error
                    ComunicWeb.common.error.syntaxtError(error, apiXHR.responseText);

                    //Set arbitray result content
                    result = {
                        error : {
                            code: 1,
                            message: "Invalid response",
                        },
                    };

                }
            }
                

            //We check if we got any error
            if(result.error){
                //Log error
                ComunicWeb.debug.logMessage("Got an error in a XHR request! \n Request URL: "+requestURL+" \n Response : "+apiXHR.responseText);

                if (result.error.code == 412) {
                    UserLogin.__userLogin = false;
                    ComunicWeb.user.loginTokens.deleteLoginTokens();
                    System.restart();
                }
            }

            //We can do the next step
            if(nextAction)
                nextAction(result);
        }
    },
}

ComunicWeb.common.api = APIClient;