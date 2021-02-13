/**
 * User functions
 * - Login tokens
 * 
 * @author Pierre HUBERT
 */

const LoginTokens = {
    
    /**
     * Set User tokens
     * 
     * @param {String} token The token
     * @param {Type} storageType The token destination (local or session)
     */
    setUserToken: function(token, storageType){
        //First, we check if there is any login token available
        this.deleteLoginTokens();

        //We store login tokens
        //If localStorage is required
        if(storageType == "local")
            localStorage.setItem("loginToken", token);
        
        else
            //Session storage
            sessionStorage.setItem("loginToken", token);
        

        //Everything is OK
        return true;

    },

    /**
     * Check if there is any login tokens available
     * 
     * @return {Boolean} True or false, depending of the result
     */
    checkLoginTokens: function(){
        //First, check in local storage
        if(localStorage.getItem("loginToken") != null)
            return true;

        //Check if we have to remove any thing in session storage
        if(sessionStorage.getItem("loginToken") != null)
            return true;

        return false;
    },

    /**
     * Get login token
     * 
     * @return {Object} Login token, if they exists (false in failure)
     */
    getLoginToken: function(){
        //First, check in local storage
        if(localStorage.getItem("loginToken") !== null)
            return localStorage.getItem("loginToken");
        

        //Then, check in session storage
        if(sessionStorage.getItem("loginToken") !== null){
            return sessionStorage.getItem("loginToken");
        }

        return false;
    },

    /**
     * Perform user logout (delete tokens)
     */
    deleteLoginTokens: function(){
        //Check if we have to remove any thing in local storage
        if(localStorage.getItem("loginToken") != "null")
            localStorage.removeItem("loginToken");
        

        //Check if we have to remove any thing in session storage
        if(sessionStorage.getItem("loginToken") != "null")
            sessionStorage.removeItem("loginToken");
    }
};

ComunicWeb.user.loginTokens = LoginTokens;