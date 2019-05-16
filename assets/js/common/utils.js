/**
 * Utilities functions
 * 
 * @author Pierre HUBERT
 */

/**
 * Create a new HTML node
 * 
 * @param {String} nodeType The type of the HTML node
 * @param {HTMLElement} appendTo Optionnal, defines node on which the new node will be applied
 * @return {HTMLElement} The newly created element
 */
function createElem(nodeType, appendTo){
	var newElem = document.createElement(nodeType);

	if(appendTo)
		appendTo.appendChild(newElem);

	//Return result
	return newElem;
}

/**
 * Create a new HTML node (version2)
 * 
 * @param {Object} infos Informations about the HTML node to create
 * @info {String} type The type of the new node
 * @info {HTMLElement} appendTo HTML Element that will receive the new node
 * @info {HTMLElement} insertBefore Insert before specified HTML element
 * @info {HTMLElement} insertAsFirstChild Insert the new HTML Element as the first child of the specified element
 * @info {String} class The class of the new element
 * @info {String} id The ID of the new element
 * @info {String} title The title of the new element
 * @info {String} src The src attribute of the new element
 * @info {String} href href attribute for the src element
 * @info {String} internalHref Link to application page
 * @info {string} name The name of the new element
 * @info {String} elemType The type attribute of the new element
 * @info {String} value The value of the new element
 * @info {String} placeholder The placeholder of the new element
 * @info {String} innerHTML Specify the html content of the newly created element
 * @info {String} innerLang Specify the key of the lang to use to fill the element
 * @info {String} innerHTMLprefix Specify prefix to add at the begining of the content of the element
 * @info {boolean} disabled Set whether the field should be disabled or not (input only)
 * @info {HTMLElement[]} children Children for the new object
 * @info {Function} onclick
 * @info {Function} ondblclick
 * @return {HTMLElement} The newly created element
 */
function createElem2(infos){

	var newElem = document.createElement(infos.type);

	//Append to a specific element
	if(infos.appendTo)
		infos.appendTo.appendChild(newElem);

	//Append before a specific element
	if(infos.insertBefore)
		infos.insertBefore.parentNode.insertBefore(newElem, infos.insertBefore);
	
	//Append as the first child of an element
	if(infos.insertAsFirstChild){
		//Check if the element as already a child or not
		if(infos.insertAsFirstChild.firstChild)
			infos.insertAsFirstChild.insertBefore(newElem, infos.insertAsFirstChild.firstChild);
		//Else we can just append the newly created element
		else
			infos.insertAsFirstChild.appendChild(newElem);
	}

	//Specify the class of the element
	if(infos.class)
		newElem.className = infos.class;

	//Specify the ID of the element
	if(infos.id)
		newElem.id = infos.id;
	
	//Specify the title of the new element
	if(infos.title)
		newElem.title = infos.title;
	
	//Specify the source of the element
	if(infos.src)
		newElem.src = infos.src;
	if(infos.href)
		newElem.href = infos.href;
	
	if(infos.internalHref){
		newElem.addEventListener("click", function(e){
			e.preventDefault(); 
			openPage(infos.internalHref);
		});
	}

	//Specify the name of the new element
	if(infos.name)
		newElem.name = infos.name;

	//Specify element type
	if(infos.elemType)
		newElem.type = infos.elemType;

	//Specify element value
	if(infos.value)
		newElem.value = infos.value;

	//Specify element placeholder
	if(infos.placeholder)
		newElem.placeholder = infos.placeholder;

	//Specify node content
	if(infos.innerHTML)
		newElem.innerHTML = infos.innerHTML;
	
	if(infos.innerLang)
		newElem.innerHTML = lang(infos.innerLang);
	
	if(infos.innerHTMLprefix)
		newElem.innerHTML = infos.innerHTMLprefix + newElem.innerHTML;

	//Set field state
	if(infos.disabled)
		infos.disabled = true;

	if(infos.children){
		infos.children.forEach(function(i){
			newElem.appendChild(i);
		});
	}

	if(infos.onclick)
		newElem.addEventListener("click", infos.onclick);
	
	if(infos.ondblclick)
		newElem.addEventListener("dblclick", infos.ondblclick);

	//Return newly created element
	return newElem;
}

/**
 * Get an HTML element specified by an ID
 * 
 * @param {String} nodeName The ID of the element
 * @return {HTMLElement} The element / False for a failure
 */
function byId(nodeName){
	return document.getElementById(nodeName);
}

/**
 * Remove all nodes of a specified HTML element
 * 
 * @param {HTMLElement} container The container to empty
 * @return {Boolean} True for a success
 */
function emptyElem(container){

	//Process each child
	while(container.children.length > 0){
		
		//Check if the child has subchild
		if(container.children[0].children)
			emptyElem(container.children[0]); //Remove them first

		//Remove child
		container.children[0].remove();
	}
	
	//Success
	return true;
}

/**
 * Delete all the content of an object
 * 
 * @param {Object} object The object to clear
 * @return {Boolean} True for a success
 */
function clearObject(object){

	//Variable (for loop) is specific to this local scop
	var i = 0;
	
	//Process each node of the object
	for(i in object){
		
		if(!object[i])
			continue;

		//Check if the node is an object
		if(object[i].toString() === "[object Object]"){
			clearObject(object[i]); //Delete object content
		}
		
		//Delete node
		delete object[i];
	}

	//Success
	return true;
}

/**
 * Check a given email address
 * 
 * @param {String} emailAddress The email address to check
 * @return {Boolean} True for a valid email address / false else
 */
function checkMail(emailAddress){
	return (emailAddress.match(/^[a-zA-Z0-9_.]+@[a-zA-Z0-9-.]{1,}[.][a-zA-Z]{2,8}$/) === null ? false : true);
}

/**
 * Create a formgroup element
 * 
 * @param {Object} infos Informations about the formgroup element to create
 * * @info {HTMLElement} target The target of the field
 * * @info {String} label The label of the field
 * * @info {string} name The name of the field
 * * @info {String} placeholder The placeholder of the field
 * * @info {Boolean} checked Defines if the fields has to be checked or not (checkbox/radio only)
 * * @info {Boolean} multiple Defines if the fields can accept more than one response
 * * @info {String} type The type of the field
 * * @info {string} value The default value of the input
 * * @info {boolean} disabled Set whether the field should be disabled or not
 * * @info {string} additionalGroupClasses Additionnal form group class names
 * @return {HTMLElement} The input 
 */
function createFormGroup(infos){

	//Check for default value
	var value = infos.value ? infos.value : "";

	//Check if the field has to be disabled
	var disabled = infos.disabled;

	//Create formgroup
	var formGroup = createElem("div", infos.target);
	formGroup.className = "form-group";

	//Add optionnal classes if required
	if(infos.additionalGroupClasses){
		formGroup.className += " " + infos.additionalGroupClasses;
	}

	//Add label
	var labelElem = createElem("label", formGroup);

	//Treatement differs if it is a checkbox
	if(infos.type == "checkbox"){

		//Create checkbox
		var input = createElem("input", labelElem) ;
		input.type = "checkbox";
		input.disabled = disabled;

		//Check if input has to be checked by default
		if(infos.checked){
			if(infos.checked === true){
				input.checked = "true";
			}
		}

		//Add label value
		var labelValue = createElem("span", labelElem);
		labelValue.innerHTML = " "+infos.label;

		//Enable iCheck
		$(input).iCheck({
			checkboxClass: 'icheckbox_flat-blue',
      		radioClass: 'iradio_flat-blue'
		});
	}

	//In case of radio input
	else if(infos.type == "radio"){

		//Create radio
		var input = createElem("input", labelElem) ;
		input.type = "radio";
		input.disabled = disabled;

		if(infos.name)
			input.name = infos.name;
		
		if(infos.value)
			input.value = infos.value;

		//Check if input has to be checked by default
		if(infos.checked){
			if(infos.checked === true){
				input.checked = "true";
			}
		}

		//Add label value
		var labelValue = createElem("span", labelElem);
		labelValue.innerHTML = " "+infos.label;

		//Enable iCheck
		$(input).iCheck({
			checkboxClass: 'icheckbox_flat-blue',
      		radioClass: 'iradio_flat-blue'
		});

	}

	//Select2
	else if(infos.type == "select2"){
		//In case of select2 element
		//Check for label
		if(infos.label)
			labelElem.innerHTML = infos.label;
		else
			labelElem.remove(); //Remove useless label element
		
		//Create input
		var input = createElem("select", formGroup);
		input.style.width = "100%";
		input.className = "form-control select2";
		input.disabled = disabled;
		if(infos.multiple) //For multiple changes
			input.setAttribute("multiple", "multiple");
		if(infos.placeholder) //Placeholder if required
			input.setAttribute("data-placeholder", infos.placeholder);

	}
	//In case of textarea
	else if(infos.type == "textarea"){
		//Fill label value
		if(infos.label)
			labelElem.innerHTML = infos.label;
		else
			labelElem.remove(); //Remove useless label element
		
		//Create textarea element
		var input = createElem2({
			appendTo: formGroup,
			type: "textarea",
			class: "form-control",
			placeholder: infos.placeholder,
			value: value,
			disabled: disabled
		});

	}
	else {
		//Else continue the function as a normal input type
		labelElem.innerHTML = infos.label;

		//Create input group
		var inputGroup = createElem("div", formGroup);
		inputGroup.className = "input-group";
		inputGroup.style.width = "100%";

		//Create input
		var input = createElem("input", inputGroup);
		input.className = "form-control";
		input.type = infos.type;
		input.placeholder = infos.placeholder;
		input.value = value;
		input.disabled = disabled;
	}

	//Return input
	return input;
}

/**
 * Create a radio element
 * 
 * @param {HTMLElement} target The target of the radio
 * @param {string} name The name of the radio group
 * @param {string} label The label of the radio
 * @return {HTMLElement} The input element of the radio
 */
function create_radio(target, name, label){

	//Container
	var radioDiv = createElem2({
		appendTo: target,
		type: "div",
		class: "radio icheck"
	});

	//Label
	var radioLabel = createElem2({
		appendTo: radioDiv,
		type: "label"
	});

	//Input
	var radioInput = createElem2({
		appendTo: radioLabel,
		type: "input",
		name: name,
		elemType: "radio"
	});

	//Add label
	createElem2({
		appendTo: radioLabel,
		type: "span",
		innerHTML: " "+ label
	});

	//Enable input
	$(radioInput).iCheck({
		checkboxClass: 'icheckbox_square-blue',
		radioClass: 'iradio_square-blue'
	});

	return radioInput;

}

/**
 * Check if a string is valid and ready to be sent to be saved
 * 
 * @param {String} value The input string to send
 * @return {Boolean} True if the string is valid, false else
 */
function checkString(value){
	
	//First, check string length
	if(value.length < 3)
		return false; //Lenght invalid

	//Success, the string seems to be valid
	return true;

}

/**
 * Remove HTML carachters : < and >
 * 
 * @param {String} input The string to change
 * @return {String} The updated string
 */
function removeHtmlTags(input){
	
	//Check if input string is empty
	if(input == null || typeof input !== "string")
		return "";

	//Prepare update
	var output = input;
	
	//Replace opening braces
	while(output.includes("<")){
		//Replace an occurence
		output = output.replace("<", "&lt;");
	}

	//Replace closing braces
	while(output.includes(">")){
		//Replace an occurence
		output = output.replace(">", "&gt;");
	}
	
	//Return result
	return output;
}

/**
 * Replace all line break with paragraph tags
 * 
 * @param {string} input Input string to convert
 * @return {string} Generated string
 */
function lineBreakToPTags(input){

	//Check if the string is empty
	if(input == null || input == "")
		return input;
	
	//Change string
	while(input.includes("\n"))
		input = input.replace("\n", "</p><p>");
	
	return "<p>"+input+"</p>";
}

/**
 * Check a URL validity
 * 
 * Source: https://gist.github.com/729294
 * 
 * @param {string} url The URL to check
 * @return {boolean} TRUE if the URL is valid
 */
function check_url(url){
	var regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i

	return url.match(regex) == null ? false : true;
}

/**
 * Add a space in an HTML element
 * 
 * @param {HTMLElement} target The target element for the space
 */
function add_space(target){

	createElem2({
		appendTo: target,
		type: "span",
		innerHTML: "&nbsp;"
	});
	
}

/**
 * Create and append a new paragraph
 * 
 * @param {HTMLElement} target The target for the new paragraph
 * @param {String} content The new content for the paragraph
 * @returns {HTMLElement} Generated element
 */
function add_p(target, content){
	return createElem2({
		appendTo: target,
		type: "p",
		innerHTML: content
	});
}

/**
 * Get the current absolute position bottom of the screen
 * 
 * @return {number} The bottom on the screen
 */
function abs_height_bottom_screen(){
	return window.scrollY + $(window).height();
}

/**
 * Page URL update detection
 * 
 * @source https://stackoverflow.com/a/1931090/3781411
 */
window.location.changed = function(e){};

(function() //create a scope so 'location' is not global
{
    var m_loc = window.location.href;
    setInterval(function()
    {
        if(m_loc != window.location.href)
        {
			m_loc = window.location.href;
			window.location.changed(window.location);
        }
    }, 900);
})();


/**
 * jQuery special event that detects the deletion
 * of a DOM element
 * 
 * @source StackOverFlow answer from mtkopone
 */
(function($){

	$.event.special.destroyed = {

		remove: function(o){
			if(o.handler)
				o.handler();
		}

	}

})(jQuery);

/**
 * Generate a new random string
 * 
 * @param {number} length The length of the string ot generate
 * @return {string} Generated string
 */
function random_string(length){

	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrst0123456789";

	for(var i = 0; i < length; i++)
		text += possible.charAt(Math.random() * possible.length);

	return text;
}

/**
 * Generate and return a new random identity image
 * 
 * @return {string} Base64 - encoded new identity image
 */
function generateIdentImage() {
	var hash = random_string(32);
	var color = Math.random() * 240;
	var color2 = Math.random() * 240;
	var color3 = Math.random() * 240;
	var options = {
		foreground: [color, color2, color3, 255],
		size: 130,
		margin: 0.2,
		format: 'png'
	};
	return new Identicon(hash, options).toString();
}

/**
 * Turn a data URI into blob
 * 
 * This function is based on Stoive answer at StackOverFlow question #4998908
 * 
 * @param {string} dataURI The URI to process
 * @return {Blob} generated blob
 */
function dataURItoBlob(dataURI){

	//convert base64 / URLEncoded data component to raw binary data held in a string
	var byteString;
	if(dataURI.split(",")[0].indexOf("base64") >= 0)
		byteString = atob(dataURI.split(",")[1]);
	else
		byteString = unescape(dataURI.split(",")[1]);
	
	
	//Separate the out the mime component
	var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

	//Write the bytes of the string to a typed array
	var ia = new Uint8Array(byteString.length);
	for(var i = 0; i < byteString.length; i++)
		ia[i] = byteString.charCodeAt(i);
	
	return new Blob([ia], {type: mimeString});

}

/**
 * Satinize some HTML source code by removing all javascript event detectors
 * from it 
 * 
 * @param {string} html The source code to update
 * @return {string} Secured html
 */
function removeJavascriptEventsFromHTML(html){
	
	//Check if the string to check is null (we will consider
	//at safe in this case)
	if(html == null)
		return html;

	//Search for unexceptable references
	while(html.match(/on[a-zA-Z ]+=/i) != null){
		var match = html.match(/on[a-zA-Z ]+=/i)[0];
		html = html.replace(match, match.replace("on", "o<block></block>n"))
	}

	return html;
}

/**
 * Get and return the DOM of a specified iframe
 * 
 * @param {HTMLIFrameElement} iframe The iframe to process
 * @return {HTMLDocument} DOM of the iframe 
 */
function GetIframeDOM(iframe){
	return iframe.contentWindow
	 ? iframe.contentWindow.document
	 : iframe.contentDocument;
}

/**
 * Initialize styles for a sceditor textarea
 * 
 * @param {HTMLTextAreaElement} textarea Target textarea element that
 * have sceditor initialized
 */
function ApplySceditorStyle(textarea){

	//Get iframe DOM
	var iframeDOM = GetIframeDOM(textarea.parentNode.getElementsByTagName("iframe")[0]);
	
	//Apply stylesheets
	document.querySelectorAll("link[rel='stylesheet']").forEach(function(entry){

		//Skip the entry if it is disabled
		if(entry.disabled)
			return;

		var elem = iframeDOM.createElement("link");
		elem.rel = "stylesheet";
		elem.href = entry.href;
		iframeDOM.head.appendChild(elem);
	});

	//Apply new styles to body
	iframeDOM.body.className += " sceditor-iframe-body";
}

/**
 * Send a new javascript event
 * 
 * @param {String} name The name of the event to create
 * @param {Object} details Information about the event to create
 */
function SendEvent(name, details){
	
	var event = new CustomEvent(name, {
		detail: details,
		bubbles: true,
		cancelable: false
	});

	document.dispatchEvent(event);

}

/**
 * Request full screen for an HTML element
 * 
 * Note : this function must be called inside of an event of
 * the user like a click, otherwise it will not work
 * 
 * This function source code is based on this StackOverFlow Answer
 *     https://stackoverflow.com/a/32100295/3781411
 * 
 * @param {HTMLElement} elem The element for which we want
 * full screen
 */
function RequestFullScreen(element){
	if (
		document.fullscreenElement ||
		document.webkitFullscreenElement ||
		document.mozFullScreenElement ||
		document.msFullscreenElement
	) {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		}
	} else {
		if (element.requestFullscreen) {
			element.requestFullscreen();
		} else if (element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		} else if (element.webkitRequestFullscreen) {
			element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
		} else if (element.msRequestFullscreen) {
			element.msRequestFullscreen();
		}
	}
}

/**
 * Check out whether Comunic has grabbed full screen or not
 * 
 * @return {Boolean} TRUE if the window is in full screen / FALSE else
 */
function IsFullScreen(){
	return document.fullscreenElement ||
		document.webkitFullscreenElement ||
		document.mozFullScreenElement ||
		document.msFullscreenElement;
}