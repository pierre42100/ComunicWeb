/**
 * Manage user login
 * 
 * @author Pierre HUBERT
 */

const UserLogin = {

    /**
     * @var {Boolean} Store user login state (true by default)
     */
    __userLogin: true,

    /**
     * @var {Integer} Store the current user ID
     */
    __userID: 0,

    /**
     * @var {number} lastAttemptResponseCode Last login attempt response code
     */
    _last_attempt_response_code: 0,



    /**
     * Tell if user is logged in or not
     * 
     * @return {Boolean} Depend of the result
     */
    getUserLoginState: function() {
        return this.__userLogin;
    },

    /**
     * Get user ID (if logged in)
     * 
     * @return {String.Boolean} User ID or false if not logged in
     */
    getUserID: function() {
        //If user is logged in
        if(this.getUserLoginState() === true){
            return this.__userID;
        }
    },

    /**
     * Try to get and store current user ID
     */
    async getCurrentUserId(){
        try {
            const result = await api("account/id", {}, true);

            // Update user ID
            ComunicWeb.user.userLogin.__userID = result.userID;

            //Notify about the event
            SendEvent("got_user_id", {
                userID: result.userID
            });

        } catch(e) {

            //Set user ID to 0 (security purpose)
            ComunicWeb.user.userLogin.__userID = 0;

            //If error is 412, make user as logged out
            if(result.error.code == 412) {
                ComunicWeb.user.userLogin.__userLogin = false;
                ComunicWeb.user.loginTokens.deleteLoginTokens();
                
                //Restart the application
                ComunicWeb.common.system.restart();
            }

        }
    },

    /**
     * Refresh the user login state
     */
    refreshLoginState: async function() {
        // First, check if we have login tokens
        if(ComunicWeb.user.loginTokens.checkLoginTokens() !== true) {
            //Specify the user isn't logged in
            this.__userLogin = false;
            this.__userID = 0;

            return;
        }

        // Try to use tokens to get user infos
        await UserLogin.getCurrentUserId();

        //We check received data
        if(this.__userID == 0){
            // We consider user is not logged in
            ComunicWeb.user.userLogin.__userLogin = false;
        }
    },

    /**
     * Try to login user
     * 
     * @param {String} usermail The mail of user
     * @param {String} userpassword The password of the user
     * @param {Boolean} permanentLogin Specify wether the login is permanent or not
     * @param {function} afterLogin What to do next
     */
    loginUser: async function(usermail, userpassword, permanentLogin, afterLogin) {
        try {
            const result = await api("account/login", {
                mail: usermail,
                password: userpassword,
            })

            //Log
            ComunicWeb.debug.logMessage("User login " + usermail + " successful !");

            //Indicates user is logged in
            ComunicWeb.user.userLogin.__userLogin = true;
            
            //Store tokens
            if(permanentLogin){
                var storageType = "local";
            }
            else {
                storageType = "session";
            }
            ComunicWeb.user.loginTokens.setUserTokens(result.tokens, storageType);

            // Save email address
            ComunicWeb.components.mailCaching.set(usermail);

            // Initialize websocket
            await UserWebSocket.Connect();
            await UserWebSocket.WaitForConnected();

            // Else refresh login state to get user ID
            await this.refreshLoginState();

            //Then get and apply user language settings
            ComunicWeb.components.settings.interface.getLanguage(function(lang){

                if(!lang.error)
                    ComunicWeb.common.langs.setLang(lang.lang);
                
                afterLogin(true);
                
            });

        } catch(e) {
            UserLogin._last_attempt_response_code = e.code;
            afterLogin(false);
        }
    },

    /**
     * Logout user
     * 
     * @param {Function} afterLogout What to do once user is logged out
     */
    logoutUser: async function(afterLogout){

        await UserWebSocket.Disconnect();

        //Prepare and make an API request
        var apiURI = "user/disconnectUSER";
        var params = {};

        //What to do after the request is completed
        var afterAPIrequest = function(result){

            //Log
            ComunicWeb.debug.logMessage("Logout request on server terminated.");

            //Perform next action (if specified)
            if(afterLogout){
                afterLogout();
            }

        };

        //Perform request
        ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, afterAPIrequest);

        //Destroy login tokens
        ComunicWeb.user.loginTokens.deleteLoginTokens();

        //Specify user is logged out
        this.__userID = 0;
        this.__userLogin = false;

        //Done !
        return 0;
    },

    /**
     * Get last login attempt response code
     */
    get_last_attempt_response_code: function(){
        return this._last_attempt_response_code;
    }
}

ComunicWeb.user.userLogin = UserLogin;