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
var data;

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
	ApplyFriendsList();
	ApplyPosts();
}

xhr.send(null);