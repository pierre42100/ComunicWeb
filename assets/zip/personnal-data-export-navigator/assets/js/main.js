/**
 * Data export visualization navigator
 *
 * @author Pierre HUBERT
 */

/**
 * This object will contains all the exported data
 * once it will have been decoded by the JSON parser
 * of the browser
 */
let data;

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
	el.className + " responsive-img";
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
 * Refresh tabs visibility accordingly to the hash of
 * the current URL
 */
function RefreshTabsVisibility(){

	var hash = location.href.toString().split("#")[1];

	if(!hash)
		return;

	document.querySelectorAll(".category").forEach(el => {

		el.style.display = el.id === hash ? "block" : "none";

	});

	document.querySelectorAll(".sidenav .bold").forEach(el => {

		let isActive = el.querySelector("a").href.includes("#" + hash);

		if(isActive && !el.className.includes(" active"))
			el.className += " active";

		if(!isActive && el.className.includes(" active"))
			el.className = el.className.replace(" active", "");

	});

}

/**
 * Apply user information
 */
function ApplyUserInfo() {

	let userInfo = data.advanced_info;
	setInnerHTMLById("u-uid", userInfo.userID);
	setInnerHTMLById("u-firstname", userInfo.firstName);
	setInnerHTMLById("u-lastname", userInfo.lastName);
	setBoolInnerHTMLById("u-pagepublic", userInfo.publicPage);
	setBoolInnerHTMLById("u-pageopen", userInfo.openPage);
	setInnerHTMLById("u-virtualdirectory", userInfo.virtualDirectory);
	applyUserAccountImage(byId("u-accountimage"), userInfo);
	setBoolInnerHTMLById("u-publicfriendslist", userInfo.friend_list_public);
	setInnerHTMLById("u-personnalwebsite", userInfo.personnalWebsite);
	setInnerHTMLById("u-publicnote", userInfo.publicNote);
	setBoolInnerHTMLById("u-commentsforbidden", userInfo.noCommentOnHisPage);
	setBoolInnerHTMLById("u-allowpostsfromfriends", userInfo.allowPostFromFriendOnHisPage);
	setInnerHTMLById("u-accountcreationtime", timeToStr(userInfo.account_creation_time));
	applyURLToImage(byId("u-bgimage"), userInfo.backgroundImage);
	setInnerHTMLById("u-pagelikes", timeToStr(userInfo.pageLikes));
}



/**
 * Automatically switch the tab when it
 * is required by the user
 */
window.addEventListener("hashchange", RefreshTabsVisibility);


//Page initialization
RefreshTabsVisibility();

/**
 * Get the content of the source file
 */
let xhr = new XMLHttpRequest();
xhr.open("GET", SOURCE_URL);

xhr.onload = function(){

	if(xhr.status != 200)
		return error("Could not access " + SOURCE_URL + " !");

	//Parse data
	try {
		data = JSON.parse(xhr.response);
	}
	catch(e){
		return error("Could not parse " + SOURCE_URL + " !");
	}

	//Now we can apply specific process for each data block
	ApplyUserInfo();
}

xhr.send(null);