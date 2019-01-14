/**
 * Project utilities
 *
 * @author Pierre HUBERT
 */

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
 * @info {string} name The name of the new element
 * @info {String} elemType The type attribute of the new element
 * @info {String} value The value of the new element
 * @info {String} placeholder The placeholder of the new element
 * @info {String} innerHTML Specify the html content of the newly created element
 * @info {String} innerLang Specify the key of the lang to use to fill the element
 * @info {String} innerHTMLprefix Specify prefix to add at the begining of the content of the element
 * @info {boolean} disabled Set whether the field should be disabled or not (input only)
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

	//Return newly created element
	return newElem;
}

/**
 * Get and return an element specified by its ID
 *
 * @param {String} id The ID of the element to get
 * @return {HTMLElement} Target element
 */
function byId(id){
	return document.getElementById(id);
}

/**
 * Set the content of an HTML element queried by
 * its ID
 *
 * @param {String} id The ID of the element to get
 * @param {String} html HTML content to apply
 */
function setInnerHTMLById(id, html){
	byId(id).innerHTML = html;
}

/**
 * Set the content of an HTML element queried by
 * its ID for a specified boolean
 *
 * @param {String} id The ID of the element to get
 * @param {Boolean} bool The boolean to apply
 */
function setBoolInnerHTMLById(id, bool){
	setInnerHTMLById(id, bool == true ? "Yes " : "No")
}

/**
 * Display an error
 * 
 * @param {String} message The message of the error to display
 */
function error(message){
	  M.toast({html: "Error: " + message, classes: 'rounded', length: 1000});
}

/**
 * Get the path to an image
 *
 * @param {String} url The original URL of the image
 * @return {String} Locally accessible path to the image
 */
function getImagePath(url){
	return STORAGE_URL + url.replace("://", "/");
}

/**
 * Turn a timestamp into a string date
 *
 * @param {Number} time The time to convert
 * @return {String} Matching date
 */
function timeToStr(time){
	let date = new Date();
	date.setTime(time*1000);
	return date.toGMTString();
}

/**
 * Apply an orignially remote image to an element
 * of the page
 *
 * @param {HTMLElement} el Image HTML Element that will receive
 * the image
 * @param {String} url The original URL of the image
 */
function applyURLToImage(el, url){
	el.src = getImagePath(url);
	el.className += " responsive-img";
}

/**
 * Apply a user image to an image object
 *
 * @param {HTMLElement} el Target HTML element
 * @param {Object} info Information about the related object
 */
function applyUserAccountImage(el, info){
	applyURLToImage(el, info.accountImage);
	el.className += " circle account-image"
}

/**
 * Get information about a single user
 *
 * @param {Number} id The ID of the user to get
 * @return {Object} Information about the user
 */
function getUserInfo(id){

	let user_info = data.users_info[id];

	//Make user full name more accessible
	user_info.full_name = user_info.firstName + " " + user_info.lastName;

	return user_info;
}

/**
 * Fill an HTML Element with user information
 *
 * @param {HMTLElement} el Target element
 * @param {Number} id The ID of the user
 */
function fillElWithUserInfo(el, id){

	let userInfo = getUserInfo(id);

	let userImage = createElem2({
		appendTo: el,
		type: "img"
	});
	applyUserAccountImage(userImage, userInfo);

	el.innerHTML += " " + userInfo.full_name;
}