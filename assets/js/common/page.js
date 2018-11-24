/**
 * Page functions
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.common.page = {

    /**
     * Save the current page url
     */
    _current_url: "",

    /**
     * Empty current page content
     * 
     * @param {Boolean} createWrapper Optionnal, define if it is required to add a wrapper 
     * container to the page
     * @return {Object} Wrapper element if it is created
     */
    emptyPage: function(createWrapper){
        //Empty body tag
        document.body.innerHTML = "";

        //Remove body speicific tags
        document.body.className = "";
        document.body.id = "";
        document.body.onclick = "";

        //Log message
        ComunicWeb.debug.logMessage("Clean the screen.");

        //If required, create the wrapper element
        if(createWrapper){
            var wrapper = document.createElement("div");
            wrapper.className = "wrapper";
            wrapper.id = "wrapper";
            document.body.appendChild(wrapper);

            //Return link to wrapper
            return(wrapper);
        }
    },


    /**
     * Show a full wait splash screen
     * 
     * @param {String} message A message to explain the reason of the splash screen (optionnal)
     */
    showWaitSplashScreen: function(message){
        //First, empty the screen
        this.emptyPage();

        //Log message
        ComunicWeb.debug.logMessage("Display a wait splash screen on the screen.");

        //Create message element (if required)
        if(message){
            var messageElem = createElem("div", document.body);
            messageElem.className = "text";
            messageElem.innerHTML = message;
        }

        //Create image element
        var imgElem = document.createElement("img");
        imgElem.src = ComunicWeb.__config.assetsURL+"img/roundProgress.gif";
        document.body.appendChild(imgElem);

        //Change body className
        document.body.className = "waitSplashScreen";

    },

    /**
     * Show a transparent wait splash screen
     * 
     * @param {HTMLElement} target Optionnal, defines the target of the transparent splashscreen
     * @returns {HTMLElement} The splash screen element to let it being deleted
     */
    showTransparentWaitSplashScreen: function(target){
        //Create the element
        var waitSplashScreen = createElem("div");
        waitSplashScreen.className = "transparentWaitSplashScreen";

        //Populate it
        var imgElem = createElem("img");
        imgElem.src = ComunicWeb.__config.assetsURL+"img/barProgress.gif";
        waitSplashScreen.appendChild(imgElem);

        //Apply splash screen
        if(!target)
            document.body.appendChild(waitSplashScreen);
        else
            target.appendChild(waitSplashScreen);

        //Return wait splash screen element
        return waitSplashScreen;
    },

    /**
     * Open a page
     * 
     * @param {String} pageURI The URI to the page
     * @param {Object} additionnalData Additionnal data to pass to the new page
     * @return {Boolean} True for a success
     */
    openPage: function(pageURI, additionnalData){

        //Log message
        ComunicWeb.debug.logMessage("Open the following page: " + pageURI);

        //Check if some additionnal data was specified
        if(!additionnalData)
            additionnalData = {};

        //Extract the first part of the URL
        var firstPartURI = pageURI.toString();
        
        //Check if there are hashtag for the URL
        if(firstPartURI.indexOf("#") != -1){
            firstPartURI = firstPartURI.split("#")[0];
        }

        //Check if there are $_GET parametres included with the URL
        if(firstPartURI.includes("?")){
            var split = firstPartURI.split("?");
            firstPartURI = split[0];

            additionnalData.urlArgs = {};

            //Process the arguments
            var list = split[1].split("&");

            for(i in list){

                //Check if it is a real argument
                if(list[i].length > 0){

                    if(!list[i].includes("=")){
                        additionnalData.urlArgs[list[i]] = null;
                    } else {
                        
                        //Add the argument to the list
                        var argument = list[i].split("=");
                        additionnalData.urlArgs[argument[0]] = argument[1];

                    }

                }

            }
        }

        //Check if pageURI is empty
        if(firstPartURI == ""){
            firstPartURI = "home";
        }

        //Save the first part of the URI as an argument
        additionnalData.rootDirectory = firstPartURI;

        //Check if there is also subfolders
        if(firstPartURI.indexOf("/") != -1){

            //Save the list of subfolders
            var subfoldersURIarray = firstPartURI.split("/");
            subfoldersURIarray.shift();
            var subfoldersURI = subfoldersURIarray.join("/");

            //Remove them to find the right page
            firstPartURI = firstPartURI.split("/")[0];
            
        } else {
            //No subfolder was specified
            var subfoldersURI = false;
        }

        //Check if specied page exists
        if(ComunicWeb.pagesList[firstPartURI]){
            var pageInfos = ComunicWeb.pagesList[firstPartURI];
        }
        
        //Else we include the 404 not found page
        else {

            //Check if no subfolder was specified
            if(subfoldersURI)
                var pageInfos = ComunicWeb.pagesList.notFound;
            
            //Find & open dynamically the appropriate page
            else {
                var pageInfos = ComunicWeb.pagesList.virtual_directory;
            }
                
        }

        //Change page title
        ComunicWeb.common.pageTitle.setTitle(pageInfos.pageTitle);

        //Change page URL, if required
        if(additionnalData.no_url_update ? !additionnalData.no_url_update : true)
            this.update_uri(document.title, pageURI);

        //Get the main container of the page
        var mainContainerElem = byId("wrapper");

        //If we didn't get anything, clean the page and create a wrapper element
        if(!mainContainerElem){
           var mainContainerElem = this.emptyPage(true);
        }

        //Check if the page requires user login
        if(pageInfos.needLogin){
            if(!signed_in())
                openPage("login");
        }

        //We check if the page is a full screen page or not
        if(pageInfos.disableMenus){
            //We force the screen to be cleaned
            var mainContainerElem = this.emptyPage(true);
            var pageTarget = mainContainerElem; //The page directly goes to the main target
        }
        //Else
        else {

            //We try to locate the target of the page
            var pageTarget = byId("pageTarget");

            //We empty screen if we couldn't rich it
            if(!pageTarget){
                mainContainerElem.innerHTML = "";

                //We create the pagetTarget element
                var pageTarget = createElem("div", mainContainerElem);
                pageTarget.id = "pageTarget";
            }
            else{
                //We can empty page target (much faster)
                pageTarget.innerHTML = "";
            }

            //Set wrapper class
            pageTarget.className = "content-wrapper";

            

            //Set body class
            document.body.className="hold-transition fixed skin-blue layout-top-nav";

            //We load the menubar
            ComunicWeb.components.menuBar.common.display();

            //Bottom
            ComunicWeb.components.bottom.main.display();

            //We load specific components for logged in users
            if(ComunicWeb.user.userLogin.getUserLoginState()){
                
                //We load friends list (if user is logged in)
                ComunicWeb.components.friends.bar.display();

                //We load conversations manager (login required)
                ComunicWeb.components.conversations.manager.display();
            }
            
            //Ask adminLTE to fix layout
            if($.AdminLTE.layout)
                $.AdminLTE.layout.fix();
        }

        //Add the subfolder URI (if any)
        if(subfoldersURI){
            additionnalData.subfolder = subfoldersURI;
        }
        
        //Call the method related to the page
        eval(pageInfos.methodHandler + ("(additionnalData, pageTarget);"));
        
        //Success
        return true;
    },

    /**
     * Refresh the current page
     */
    refresh_current_page: function(){
        //Get current page URI
        var currentPage = ComunicWeb.common.url.getCurrentWebsiteURL();

        //Open a page
        this.openPage(currentPage, {no_url_update: true});
    },

    /**
     * Safely trigger URL update
     * 
     * @param {String} title The new title of the page
     * @param {String} uri The new URL
     */
    update_uri: function(title, uri){

        //Trigger URL update
        ComunicWeb.common.url.changeURI(title, uri);

        //Save new url
        this._current_url = window.location.href.toString();
    },

    /**
     * Inform of page location update
     * 
     * @param {location} new_location The new location of the page
     */
    location_updated: function(new_location){

        //Check if the url change has already been handled or not
        if(new_location.href.toString() != this._current_url)

            //Open the page using url detection
            this.refresh_current_page();

    },

    /**
     * Prepare a template load by specifiying datas
     * 
     * @return {Object} The object container with all required infos
     */
    prepareLoadTemplate: function(){
        //Create an object
        var obj = {
            templateURL: "",
            templateDatas: "",
        };

        //Return object
        return obj;
    },

    /**
     * Load, parse and show an HTML template
     * 
     * @param {Object} targetElem The target element where the template will be applied
     * @param {Object} dataTemplate Datas to pass to the template (to parse it)
     * @param {String} templateURI URI pointing on the template
     * @param {function} afterParsingHTMLtemplate What to do once the template is loaded
     * @param {Boolean} cleanContainer Specify if container has to be cleaned or not
     * @return {Boolean} False if it fails
     */
    getAndShowTemplate: function(targetElem, dataTemplate, templateURI, afterParsingHTMLtemplate, cleanContainer){

        //First, get the template URL
        templateURL = ComunicWeb.__config.templatesURL + templateURI;
        
        //Define how to apply the template
        var afterDownloadTemplateContent = function(templateContent){

            //If required, clean the container
            if(cleanContainer){
                targetElem.innerHTML = "";
            }

            //Apply data templates
            for(elemName in dataTemplate){
                //We change the template content while it still exists
                while(templateContent.indexOf("{"+elemName+"}") != -1){
                    templateContent = templateContent.replace("{"+elemName+"}", dataTemplate[elemName]);
                } 
            }

            //Apply required translations
            while(templateContent.includes("[[")){

                //Get the full template inclusion
                var source = templateContent.match(/\[\[.*\]\]/i)[0];

                //Determine lang key
                var key = source.replace("[[", "").replace("]]", "");
                var translation = lang(key);

                //Apply lang
                while(templateContent.includes(source))
                    templateContent = templateContent.replace(source, translation);
            }

            //Apply template source
            targetElem.innerHTML = templateContent;

            //Make links live
            var aElems = targetElem.getElementsByTagName("a");
            for(num in aElems){

                //Export current element
                var currentElement =  aElems[num];
                
                //Check if it is a real html elements and if it contains a "target" attribute
                if(currentElement.attributes){
                    if(currentElement.attributes.target){

                        //Change the onclick behavior of the elements
                        currentElement.onclick = (function() {
                            ComunicWeb.common.page.openPage(this.getAttribute("target"));
                        });

                    }
                }
            }

            //Perform next action (if there is)
            if(afterParsingHTMLtemplate)
                afterParsingHTMLtemplate();

        };

        //Perform request
        if(!ComunicWeb.common.network.getRequest(templateURL, true, afterDownloadTemplateContent))
            //An error occured
            return false;
    },

    /**
     * Convert a JSON object into html elements
     * 
     * @param {Object} parentNodeChilds The parent which contains the childs to convert (an object)
     * @param {Object} values Optionnal, fill the template with predefined values
     * @returns {HTMLObject} The processed JSON code
     */
    convertJSONobjectTOhtmlElement: function(parentNodeChilds, values){
        //Create variable
        var resultElements = {};

        //Process each element of the array
        for(elemID in parentNodeChilds){

            //Determine object type
            var objType = (parentNodeChilds[elemID].nodeType ? parentNodeChilds[elemID].nodeType : elemID);
            
            //Create object
            var element = document.createElement(objType);
            element.elemID = elemID;

            //Populate it with its informations
            for(fieldName in parentNodeChilds[elemID]){
                if(fieldName == "nodeType"){
                    //Do nothing
                }

                //We perform children generation if required
                else if(fieldName == "children"){
                    //Call the function to get the element's childs and apply them
                    var elemChilds = this.convertJSONobjectTOhtmlElement(parentNodeChilds[elemID][fieldName], values);
                    for(childID in elemChilds){
                        element.appendChild(elemChilds[childID]);
                    }
                }

                //We check if it is innerHTML filling
                else if(fieldName == "innerHTML"){
                    element.innerHTML = parentNodeChilds[elemID][fieldName];
                }
                
                //We check if it is auto filling system which is called
                else if (fieldName == "autofill"){
                    //Check if required value exists in the data
                    if(values){
                        if(values[parentNodeChilds[elemID][fieldName]]){
                            //Then fill field with the value
                            element.innerHTML = values[parentNodeChilds[elemID][fieldName]];
                        }
                    }
                }

                //For other input, we use "setAttribute"
                else{
                    element.setAttribute(fieldName, parentNodeChilds[elemID][fieldName]);
                }
            }

            //Save element
            resultElements[element.elemID] = element;
        }

        //Return result
        return resultElements;
    },

    /**
     * Get and show a JSON template
     * 
     * @param {Object} targetElem The target element where the template will be applied
     * @param {String} templateURI URI pointing on the template
     * @param {Object} additionalData Additionnal to pass to the template
     * @param {function} afterParsingJSONtemplate What to do once JSON template is loaded
     * @param {Boolean} cleanContainer Specify wether the template container has to be cleaned or not
     * @return {Boolean} Flase if it fails
     */
    getAndShowJSONtemplate: function(targetElem, templateURI, additionalData, afterParsingJSONtemplate, cleanContainer){
        //Define template URL
        var templateURL = ComunicWeb.__config.templatesURL + templateURI;

        //Define how to apply the template
        var afterTemplateDownload = function(templateContent){
            //Decode JSON content
            var JSONobject = JSON.parse(templateContent);
            
            //Check if parsing failed
            if(!JSONobject){
                ComunicWeb.debug.logMessage("Parsing JSON failed with this file: " + templateURL);
                return false;
            }
            
            //Parse JSON object
            var result = ComunicWeb.common.page.convertJSONobjectTOhtmlElement(JSONobject, additionalData);

            //Apply each result element
            for(elem in result){
                targetElem.appendChild(result[elem]);
            }

            //Perform next action if required
            if(afterParsingJSONtemplate){
                afterParsingJSONtemplate();
            }

            //Everything OK
            return true;
        };

        //Perform request
        if(!ComunicWeb.common.network.getRequest(templateURL, true, afterTemplateDownload))
            //An error occured
            return false;
    }
};