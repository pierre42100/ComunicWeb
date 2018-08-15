/**
 * Lang functions
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.common.langs = {

    /**
     * Languages list
     */
    list:  {

        en: {
            name: "English",
            local_name: "English"
        },

        fr: {
            name: "French",
            local_name: "Français"
        }
    },

    /**
     * Local storage lang item name
     */
    _lang_storage_field_name: "comunic_v2_lang",

    /**
     * Currently selected language
     */
    __currentLang: "en",

    /**
     * Default langage (updated on init)
     */
    __defaultLang: "en",
    

    /**
     * Get current language
     *
     * @return {String} The id of the current language
     */
    current: function(){
        
        //Check if a language has been set in local storage
        if(localStorage.getItem(this._lang_storage_field_name) != null)
            return localStorage.getItem(this._lang_storage_field_name);

        //Get user language
        var language = navigator.language || navigator.userLanguage;

        if(language){
            return language.split("-")[0];
        }

        //Else return default language
        return ComunicWeb.__config.defaultLanguage;
    },

    /**
     * Set language
     * 
     * @param {String} lang The language to set
     */
    setLang: function(lang){

        //Set new language in local storage
        localStorage.setItem(this._lang_storage_field_name, lang);

        //Save name
        this.__currentLang = lang;
    },

    /**
     * Language initiator
     * 
     * @return {Boolean} False if it fails
     */
    initLanguages: function(){
        
        //Debug message
        ComunicWeb.debug.logMessage("Get and install languages...");

        //Get languages to install
        this.__currentLang = this.current();
        this.__defaultLang = ComunicWeb.__config.defaultLanguage;

        //Everything is OK
        return 0;
    },

    /**
     * Return a string in correct language
     * 
     * @param {String} stringName The name of the string to show
     * @param {Array} stringParams The optionnal parametres to include with the string
     * @return {String} The string ready to show
     */
    getTranslatedText: function(stringName, stringParams){
        //Try to get string
        if(this[this.__currentLang][stringName])
            var string = this[this.__currentLang][stringName];
        else if(this[this.__defaultLang][stringName])
            var string = this[this.__defaultLang][stringName];
        else
            var string = "No Translated String";
        
        //Change string with parametres if required
        if(stringParams){
            for(i in stringParams){
                string = string.replace("%p", stringParams[i]);
            }
        }

        return string;
    },
}