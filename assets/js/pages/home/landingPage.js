/**
 * Landing home page
 * 
 * @author Pierre HUBERT
 */
ComunicWeb.pages.home.landingPage = {
    /**
     * Display home landing page
     *
     * @param {element} targetElement Where the page will be applied
     */
    display: function(targetElement){
        //Log action
        ComunicWeb.debug.logMessage("Open home landing page.");

        //Change page title
        ComunicWeb.common.pageTitle.setTitle("Comunic, a transparent social network");

        //Prepare additional data
        var additionalData = {
            
            //About the website URL
            about_url: ComunicWeb.__config.aboutWebsiteURL,

            //Background image URL
            backgroundImage: ComunicWeb.__config.assetsURL + "img/pages/home/landingPage/img_background.jpg"

        };

        //Apply template
        ComunicWeb.common.page.getAndShowTemplate(targetElement, additionalData, "pages/home/landingPage/home.tpl", false, true);
    }
};