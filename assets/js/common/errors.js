/**
 * Comunic errors handler
 * 
 * @author Pierre HUBERT
 */

/**
 * Submit an error
 * 
 * @param {String} errorLevel The level of the error
 * @param {String} errorMessage The message associated with error
 * @param {Integer} errorCode The code of the error
 * @param {String} errorData Data associated with error
 */
ComunicWeb.common.error.submitError = function(errorLevel, errorMessage, errorCode, errorData){
	//Prepare API request
	/*var apiURI = "webApp/reportError";
	var params = {
		"errorLevel": errorLevel,
		"errorMessage": errorMessage,
		"errorCode": errorCode,
		"errorData": errorData.toSource(),
	}
	var requireLoginToken = false;

	//Not any next action for now
	nextAction = function(){};

	//Send API request
	ComunicWeb.common.api.makeAPIrequest(apiURI, params, requireLoginToken, nextAction);*/
}

/**
 * Handle and show a fatal error
 * 
 * @param {String} errorMessage The message associated with error
 * @param {Integer} errorCode The code of the error
 * @param {String} errorData Data associated with error
 */
ComunicWeb.common.error.fatalError = function(errorMessage, errorCode, errorData){
	//Each not defined value is empty by default
	if(!errorMessage)
		var errorMessage = "Undefined error message";
	if(!errorCode)
		var errorCode = 0;
	if(!errorData)
		var errorData = {};

    //Make a black splash screen
    var splashScreen = document.createElement("div");
    splashScreen.style.position = "fixed";
    splashScreen.style.width = "100%";
    splashScreen.style.height = "100%";
    splashScreen.style.top = "0px";
    splashScreen.style.zIndex = "999999";
    splashScreen.style.backgroundColor = "#000000";
    
    //Show a message on screen to inform user
    var messageElem = ComunicWeb.common.messages.createCalloutElem(lang("__fatal_error"), lang("__fatal_error_explanation", [errorMessage]), "danger");
    messageElem.style.position = "relative";
    messageElem.style.margin = "auto";
    messageElem.style.width = "50%";
    messageElem.style.top  = "10%";

    //Append the message on the screen
    splashScreen.appendChild(messageElem);

    //Apply splash screen
    document.body.appendChild(splashScreen);

    //Make an API request to submit error
	this.submitError("fatal", errorMessage, errorCode, errorData);
}

/**
 * Handle and show a 404 not found error message
 * 
 * @param {Object} additionnalData Additionnal data passed in the method
 * @param {element} targetElement Where the template will be applied
 * @return {Boolean} True for a success
 */
ComunicWeb.common.error.pageNotFound = function(additionnalData, targetElement){
	
	//Show template element
	var templateURI = "common/errors/error.tpl";
	var dataTemplate = {
		error_code: "404",
		error_title: "Page not found",
		error_message: "The requested page ("+location.href+") was not found on this website. Please check your request..."
	};
	ComunicWeb.common.page.getAndShowTemplate(targetElement, dataTemplate, templateURI, (function(){}), true);
	
	//Report error
	var errorData = {
		pageURL: location.href,
	};
	this.submitError("normal", "Page not found", "404", errorData);

	//Everything seems to be OK
	return true;
}

/**
 * Handles and display SyntaxtError
 * 
 * @param {SyntaxError} error The error
 * @param {string} additional Additionnal information to include with
 * the report
 */
ComunicWeb.common.error.syntaxtError = function(error, additional){
	
	//Do not do anything in production mode
	if(ComunicWeb.__config.productionMode == true)
		return;

	//Create a modal dialog to report error
	var dialog = ComunicWeb.common.messages.createDialogSkeleton({
		type: "danger",
		title: "An error occurred"
	});

	//Display modal
	$(dialog.modal).modal("show");

	//Create close modal function
	var closeModal = function(){
		$(dialog.modal).modal('hide');
        emptyElem(dialog.modal);
        dialog.modal.remove();
	}
	dialog.closeModal.onclick = closeModal;
	dialog.cancelButton.onclick =  closeModal;

	//Create error container
	var errorContainer = createElem2({
		appendTo: dialog.modalBody,
		type: "div"
	});

	//Message
	createElem2({
		appendTo: errorContainer,
		type: "p",
		innerHTML: "An error has just occured. There are the details of the error. If this error occurs several times, please inform us at contact@communiquons.org ."
	});

	//Locate error
	createElem2({
		appendTo: errorContainer,
		type: "p",
		innerHTML: "<b>File:</b> "+error.fileName+" <b>Line:</b> " + error.lineNumber+ " <b>Column:</b> " + error.columnNumber
	});

	//Error message
	createElem2({
		appendTo: errorContainer,
		type: "p",
		innerHTML: "<b>Message:</b> " + error.message,
	});

	//Stack trace
	createElem2({
		appendTo: errorContainer,
		type: "pre",
		innerHTML: error.stack
	});

	//Check for additional information
	if(additional){
		createElem2({
			appendTo: errorContainer,
			type: "pre",
			innerHTML: "Additionnal information: \n " + additional
		});
	}
}