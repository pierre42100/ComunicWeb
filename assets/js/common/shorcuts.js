/**
 * This file contains shorcuts to ease access of common functions
 * 
 * @author Pierre HUBERT
 */

/**
 * Perform an API request
 * 
 * @param {String} uri The URI of the request on the API
 * @param {Object} args The list of arguments to pass with the request
 * @param {Bool} withLogin Specify whether login is required or not to
 * achieve the request
 * @return {Promise}
 */
function api(uri, args, withLogin){
    return APIClient.exec(uri, args, withLogin);
}

/**
 * Perform a requests through the WebSocket
 * 
 * @param {String} title The title of the request
 * @param {Object} data Data to include to request
 * @return {Promise}
 */
function ws(title, data = {}) {

    if(typeof data != "object")
        throw new Error("Invalid data for websocket request!");

    return UserWebSocket.SendRequest(title, data);
}

/**
 * Create a quick language access function shortcut
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
        openUserPageFromID(user.userID ? user.userID : user.id);
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
    return UserLogin.getUserLoginState();
}

/**
 * Returns user ID (if logged in)
 * 
 * @param Nothing
 * @return {Integer} The ID of the user
 */
function userID(){
    return UserLogin.getUserID();
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
function getMultipleUsersInfo(usersID, afterGetUserInfos, forceRequest){
	ComunicWeb.user.userInfos.getMultipleUsersInfo(usersID, afterGetUserInfos, forceRequest);
}

/**
 * Get information about multiple users
 * 
 * @param {Array~Object} users The list of users to get
 * @param {Boolean} force
 * @returns {Promise<UsersList>}
 */
function getUsers(users, force) {
    return new Promise((resolve, error) => {
        getMultipleUsersInfo(users, result => {

            if(result.error) 
                error(result.error);

            else
                resolve(new UsersList(result));

        }, force);
    });
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
 * Get information about a single user asynchronously
 * 
 * @param {Number} userID Target user ID
 */
function userInfo(userID, force = false) {
    return new Promise((res, err) => {
        getUserInfo(userID, (data) => {
            if(data.error)
                err(data.error)
            else
                res(data)
        }, force);
    });
}

/**
 * Get information about a user (new User class)
 * 
 * @param {Number} userID target user id
 * @returns {Promise<User>} Information about the user
 */
async function user(userID) {
    return new User(await userInfo(userID))
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
 * @param {bool} fullscreen Specify whether the conversation has to
 * appear in full screen or not
 */
function openConversation(id, fullscreen = false){
    if(!fullscreen)
        ComunicWeb.components.conversations.manager.addConversation(id);
    else
        openPage("conversations/" + id);
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

/**
 * Get information about multiple groups
 * 
 * @param {Number[]} list The ID of the groups to get
 * @param {Boolean} force Specify whether to force or not the request
 * @return {Promise<GroupsList>}
 */
function getGroups(list, force){
    return new Promise((resolve, reject) => {
        getInfoMultipleGroups(list, result => {
            if(result.error) reject(result.error);
            else resolve(new GroupsList(result));
        }, force);
    });
}

/**
 * Get the difference of time from now to a specified
 * timestamp and return it as a string
 * 
 * @param {Integer} time The base time
 * @return {String} Computed difference
 */
function timeDiffToStr(time) {
    return ComunicWeb.common.date.timeDiffToStr(time);
}

/**
 * Ask a confirmation to the user
 * 
 * @param {String} msg Associated message
 */
async function showConfirmDialog(msg) {
    return new Promise((res, err) => {
        ComunicWeb.common.messages.confirm(msg, (c) => {
            res(c == true);
        });
    })
}


/**
 * Ask the user to enter a string
 * 
 * @param {String} title The dialog of the dialog to show
 * @param {String} message Helper message to show to the user
 * @param {String} defaultValue The default value of the message
 */
async function showInputTextDialog(title, message, defaultValue = "") {
    return new Promise((res, rej) => 
        ComunicWeb.common.messages.inputString(
            title,
            message,
            defaultValue,
            (msg) => msg === false ? rej() : res(msg)
        )
    )
}

/**
 * Prepare for potential future translation system
 * 
 * @param {String} input Input string
 * @param {Object} arguments Arguments to apply to the string
 */
function tr(input, values) {
    
    // Apply arguments
    for (const key in values) {
        if (Object.hasOwnProperty.call(values, key))
            input = input.replace("%"+key+"%", values[key]);
    }

    return input;
}