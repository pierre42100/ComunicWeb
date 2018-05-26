/**
 * Account interface
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.account.interface = {

	/**
	 * Send a request on the server to create an account
	 * 
	 * @param {string} firstName The first name of the user
	 * @param {string} lastName The last name of the user
	 * @param {email} emailAddress The email adress of the user
	 * @param {password} password The password of the user
	 * @param {callback} callback The callback function
	 */
	createAccount: function(firstName, lastName, emailAddress, password, callback){

		//Make an API request
		var apiURI = "account/create";
		var params = {
			"firstName": firstName,
			"lastName": lastName,
			"emailAddress": emailAddress,
			"password": password
		};

		//Perform an API request
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, false, callback);

	},

	/**
	 * Check whether an email address is linked to an account or not
	 * 
	 * @param {String} email The email address to check
	 * @param {function} callback
	 */
	existsMail: function(email, callback){
		var apiURI = "account/exists_email";
		var params = {
			email: email
		};
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);
	},

	/**
	 * Check whether the security questions have been set for an account 
	 * with an email address or not
	 * 
	 * @param {String} email The email address of the account
	 * @param {function} callback
	 */
	checkSecurityQuestionsExistence: function(email, callback){
		var apiURI = "account/has_security_questions";
		var params = {
			email: email
		};
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);
	},

	/**
	 * Given an email address, returns the security questions of a user
	 * 
	 * @param {String} email The email address of the account
	 * @param {function} callback
	 */
	getSecurityQuestions: function(email, callback){
		var apiURI = "account/get_security_questions";
		var params = {
			email: email
		};
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);
	},

	/**
	 * Get passowrd reset token using security answer
	 * 
	 * @param {String} email The email address of the account
	 * @param {Array} answers The answers to the security questions
	 * @param {Function} callback
	 */
	resetPasswordWithSecurityAnswers: function(email, answers, callback){

		//Prepare answers
		answersText = "";
		answers.forEach(function(answer){
			
			if(answersText != "")
				answersText += "&";
			
			answersText += encodeURIComponent(answer);

		});

		//Perform the request
		var apiURI = "account/check_security_answers";
		var params = {
			email: email,
			answers: answersText
		};
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);

	},


	/**
	 * Request the export of all the data of the user
	 * 
	 * @param {String} password The password of the user
	 * @param {function} callback
	 */
	exportData: function(password, callback){
		var apiURI = "account/export_data";
		var params = {
			password: password
		};
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);
	},

	/**
	 * Request the deletion of the account
	 * 
	 * @param {string} password The password of the account
	 * @param {function} callback
	 */
	deleteAccount: function(password, callback){
		var apiURI = "account/delete";
		var params = {
			password: password
		};
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);
	},

}