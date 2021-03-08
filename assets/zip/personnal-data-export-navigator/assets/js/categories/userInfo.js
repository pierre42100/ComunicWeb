/**
 * User information category
 * 
 * @author Pierre HUBERT
 */

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
	setInnerHTMLById("u-pagelikes", timeToStr(userInfo.pageLikes));
}