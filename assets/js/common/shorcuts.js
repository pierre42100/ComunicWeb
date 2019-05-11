/**
 * This file contains shorcuts to ease access of common functions
 * 
 * @author Pierre HUBERT
 */

/**
 * Create a quick language access function shorcut
 * 
 * @param {String} stringName The name of the string to show
 * @param {Array} stringParams The optionnal parametres to include with the string
 * @return {String} The string ready to show
 */
function lang(stringName, stringParams){
    //Check if any params has been specified
    if(!stringParams)
        var stringParams = [];

    //Call translate function
    return ComunicWeb.common.langs.getTranslatedText(stringName, stringParams);
}

/**
 * Function to change currently opened page
 * 
 * @param {String} pageURI The URI to the page
 * @param {Object} additionnalData Additionnal data to pass to the new page
 * @return {Boolean} True for a success
 */
function openPage(pageURI, additionnalData){
	return ComunicWeb.common.page.openPage(pageURI, additionnalData);
}

/**
 * Open a user page quickly
 * 
 * @param {String} user The ID of the user or its directory
 * @return {Boolean} True for a success
 */
function openUserPage(user){
    if(user.virtualDirectory == "")
        openUserPageFromID(user.userID);
    else
        openPage(user.virtualDirectory);
}

/**
 * Open a user page quickly from its user ID
 * 
 * @param {String} user The ID of the user or its directory
 * @return {Boolean} True for a success
 */
function openUserPageFromID(user){
    return openPage("user/" + user);
}

/**
 * Open a group age
 * 
 * @param {Object} info Information about the target group
 */
function openGroupPage(info){

    if(info.virtual_directory != "null")
        openPage(info.virtual_directory);
    else
        openPage("groups/" + info.id);

}

/**
 * Check if user is signed in or not
 * 
 * @return {Boolean} True if the user is signed in / false else
 */
function signed_in(){
    return ComunicWeb.user.userLogin.getUserLoginState();
}

/**
 * Returns user ID (if logged in)
 * 
 * @param Nothing
 * @return {Integer} The ID of the user
 */
function userID(){
    return ComunicWeb.user.userLogin.getUserID();
}

/**
 * Returns the full name of a user
 * 
 * @param {Object} infos Informations about the user
 * @return {String} The full name of the user
 */
function userFullName(infos){
    return infos.firstName + " " + infos.lastName;
}

/**
 * Return the ID of a user, or its path, depending of what 
 * is available
 * 
 * @param {Object} infos Informations about the user
 * @return {String} The ID of the user, or it's path
 */
function userIDorPath(infos){
    return ComunicWeb.user.userInfos.getIDorPath(infos);
}

/**
 * Get multiple users informations
 * 
 * @param {Array~Object} usersID User on which to make request (current to get connected user)
 * @param {function} afterGetUserInfos What to do once users informations are available
 * @param {Boolean} forceRequest Force the request to be made
 * @return {Boolean} True for a success
 */
function getMultipleUsersInfos(usersID, afterGetUserInfos, forceRequest){
	ComunicWeb.user.userInfos.getMultipleUsersInfos(usersID, afterGetUserInfos, forceRequest);
}

/**
 * Get information about a single user
 * 
 * @param {int} userID User on which to make request
 * @param {function} afterGetUserInfo What to do once users informations are available
 * @param {Boolean} forceRequest Force the request to be made
 * @return {Boolean} True for a success
 */
function getUserInfo(usersID, afterGetUserInfo, forceRequest){
	ComunicWeb.user.userInfos.getUserInfos(usersID, afterGetUserInfo, forceRequest);
}

/**
 * Display message on browser console
 * 
 * @param {String} message The message to show on browser console
 */
function log(message){
    ComunicWeb.debug.logMessage(message);
}

/**
 * Open a conversation specified by its ID
 * 
 * @param {number} id The ID of the conversation to open
 */
function openConversation(id){
    ComunicWeb.components.conversations.manager.addConversation({
        conversationID: id
    });
}

/**
 * Display a notification
 * 
 * @param {string} message The message of the notification
 * @param {string} type The type of the notification (danger, info, success, primary)
 * @param {number} duration The notification duration
 * @param {string} title The title of the notification
 */
function notify(message, type, duration, title){
    ComunicWeb.common.notificationSystem.showNotification(message, type, duration, title)
}

/**
 * Get information about a single group
 * 
 * @param {Number} id The ID of the group to fetch
 * @param {Function} callback
 */
function getInfoGroup(id, callback){
    ComunicWeb.components.groups.info.getInfo(id, callback);
}

/**
 * Get information about multiple groups
 * 
 * @param {Array} IDs The IDs of the groups to get information about
 * @param {Function} callback Callback to call once we have information about the group
 * @param {Boolean} force TRUE to force the request (ignore cache)
 */
function getInfoMultipleGroups(IDs, callback, force){
    ComunicWeb.components.groups.info.getInfoMultiple(IDs, callback, force);
}