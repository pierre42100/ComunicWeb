/**
 * Common homes functions
 * 
 * @author Pierre HUBERT
 */
ComunicWeb.pages.home.home = {
    /**
     * Open home page
     * 
     * @param {Object} additionnalData Additionnal data passed in the method
     * @param {element} targetElement Where the template will be applied
     * @returns {Boolean} False if it fails
     */
    openHomePage: function(additionnalData, targetElement){
        //Check wether if user is logged in or not
        var userLoggedIn = ComunicWeb.user.userLogin.getUserLoginState();

        //Check if user is in or not
        if(userLoggedIn){
            
            //Open current user page
            ComunicWeb.pages.latestPosts.main.open(additionnalData, targetElement);

        }
        else{
            //Display landing page
            ComunicWeb.pages.home.landingPage.display(targetElement);
        }

        //Everything seems to be OK
        return true;
    }
};