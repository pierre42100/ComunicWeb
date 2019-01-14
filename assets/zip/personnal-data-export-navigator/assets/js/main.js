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
 * Apply friends list
 */
function ApplyFriendsList(){

	let target = document.querySelector("#friends-list-table tbody");

	data.friends_list.forEach(friend => {

		let friendInfo = getUserInfo(friend.ID_friend);

		let friendTR = createElem2({
			appendTo: target,
			type: "tr"
		});

		let friendName = createElem2({
			appendTo: friendTR,
			type: "td"
		});

		let friendAccoutImage = createElem2({
			appendTo: friendName,
			type: "img"
		});
		applyUserAccountImage(friendAccoutImage, friendInfo)

		friendName.innerHTML += friendInfo.full_name;

		let friendAccepted = createElem2({
			appendTo: friendTR,
			type: "td",
			innerHTML: friend.accepted ? "Yes" : "Not yet"
		});

		let friendLastActive = createElem2({
			appendTo: friendTR,
			type: "td",
			innerHTML: timeToStr(friend.time_last_activity)
		});
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
}

xhr.send(null);