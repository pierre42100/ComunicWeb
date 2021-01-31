/**
 * Operations of Javascript files
 * 
 * @author Pierre HUBERT
 */

/**
 * Include a Javascript file
 * 
 * @param {String} fileURL The file URL
 * @return {Boolean} False if it fails
 */
async function includeJS(fileURL) {
    var fileElem = document.createElement("script");
    fileElem.type = "text/javascript";
    fileElem.innerHTML = await (await fetch(fileURL)).text();

    //Append the new element
    document.head.appendChild(fileElem);

    //Debug message
    ComunicWeb.debug.logMessage("Added JS file " + fileURL);

    //Everything is OK
    return true;
}

/**
 * Execute some source code contained in a variable
 * 
 * @param {String} source The source code to execute
 */
function executeJSsource(source){
    var jsSourceContainer = document.createElement("script");
    jsSourceContainer.innerHTML = source;
    document.body.appendChild(jsSourceContainer);
}