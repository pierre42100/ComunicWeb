/**
 * Account data export worker
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.account.export.worker = {

	/**
	 * Start account export
	 * 
	 * @param {String} password The password of the user
	 */
	start: function(password){

		//Get all user text data from the interface
		ComunicWeb.components.account.interface.exportData(password, function(result){
			
			//Check for errors
			if(result.error){
				return ComunicWeb.components.account.export.ui.exportFatalError("Could not get text data! Please check your password...");
			}

			//Update progress
			ComunicWeb.components.account.export.ui.updateMessage("Got text data");
			ComunicWeb.components.account.export.ui.updateProgress(10);

			//Get explorer
			ComunicWeb.components.account.export.worker.getExplorer(result);
		});

	},

	/**
	 * Second step for export : Get and open personnal data explorer
	 * 
	 * @param {Object} data Text data about the account (data not modified at this stage)
	 */
	getExplorer: function(data){

		ComunicWeb.components.account.export.ui.updateMessage("Getting data explorer");
		ComunicWeb.components.account.export.ui.updateProgress(15);

		JSZipUtils.getBinaryContent(ComunicWeb.__config.assetsURL+"zip/personnal-data-export-navigator.zip", function(err, file){

			if(err != null){
				ComunicWeb.debug.logMessage("Could not get personnal data export navigator!");
				ComunicWeb.components.account.export.ui.exportFatalError(e);
				return;
			}

			JSZip.loadAsync(file).then(function(zip){

				//Ready to parse data
				ComunicWeb.components.account.export.worker.parse(data, zip);

			}).catch(function(){
				ComunicWeb.debug.logMessage("Could not parse personnal data export navigator!");
				ComunicWeb.components.account.export.ui.exportFatalError(e);
				return;
			});

		});
	},

	/**
	 * Parse account text data into ZIP file
	 *
	 * @param {Object} data Text data about the account
	 * @param {ZIP} zip The ZIP object to fill
	 */
	parse: function(data, zip){
		
		//Get UI shortcut
		var ui = ComunicWeb.components.account.export.ui;

		var Promise = window.Promise;
		if (!Promise) {
			Promise = JSZip.external.Promise;
		}

		/**
		 * Fetch the content and return the associated promise.
		 * @param {String} url the url of the content to fetch.
		 * @return {Promise} the promise containing the data.
		 */
		function urlToPromise(url) {
			return new Promise(function(resolve, reject) {
				JSZipUtils.getBinaryContent(url, function (err, data) {
					if(err) {
						reject(err);
					} else {
						resolve(data);
					}
				});
			});
		}

		/**
		 * Transform an URL into a path in the archive
		 * 
		 * @param {String} url The URL to transform
		 * @return {String} Generated file path
		 */
		function urlToPath(url) {
			var path = url.replace("://", "/");
			return "files/" + path;
		}

		//Determine the list of files to download
		var files_list = this._generate_files_list(data);

		//Add raw json file
		zip.file("source.json", JSON.stringify(data));
		
		//Add the files to download
		files_list.forEach(function(url){
			var path = urlToPath(url);
			zip.file(path, urlToPromise(url), {binary:true});
		});

		//Generated zip archive
		zip.generateAsync({type:"blob"}, function updateCallback(metadata) {
			var msg = "progression : " + metadata.percent.toFixed(2) + " %";
			if(metadata.currentFile) {
				msg += ", current file = " + metadata.currentFile;
			}
			ui.updateMessage(msg);
			ui.updateProgress(metadata.percent.toFixed(2));
		})

		//Trigger download
		.then(function callback(blob) {
	
			//Download file
			saveAs(blob, "accountData.zip");
			
			//Update progress
			ui.updateProgress(100);
			ui.updateMessage("Done !");

		}, function (e) {
			//In case of error
			ComunicWeb.components.account.export.ui.exportFatalError(e);

			//Update progress
			ui.updateProgress(100);
			ui.updateMessage("Error !");
		});

	},

	/**
	 * Determine the list of files to download
	 * 
	 * @param {Object} data Dataset to parse
	 * @return {Array} Generated dataset
	 */
	_generate_files_list: function(data){
		
		var files = [];
		
		/**
		 * Parse user information to find potential files to download
		 * 
		 * @param {Object} info Information about the comment to parse
		 */
		var parseUserInfo = function(info){
			if(info.accountImage != null)
				if(!files.includes(info.accountImage))
					files.push(info.accountImage);
		}

		/**
		 * Parse a comment to find potential files to download
		 * 
		 * @param {Object} info Information about the comment to parse
		 */
		var parseComment = function(info){
			if(info.img_url != null)
				if(!files.includes(info.img_url))
					files.push(info.img_url);
		}

		/**
		 * Parse a post to find potential files to download
		 * 
		 * @param {Object} info Information about the post to parse
		 */
		var parsePost = function(post){
			
			if(post.kind != "youtube"){
				if(post.file_path_url != null){
					if(!files.includes(post.file_path_url))
						files.push(post.file_path_url);
				}
			}

			//Parse comments
			post.comments.forEach(parseComment);
		}

		/**
		 * Parse a conversation message to find potential files to download
		 * 
		 * @param {Object} info Information about the conversation to parse
		 */
		var parseConversationMessage = function(info){
			if(info.image_path != null)
				if(!files.includes(info.image_path))
					files.push(info.image_path);
		}


		//Main account information
		files.push(data.advanced_info.accountImage);
		files.push(data.advanced_info.backgroundImage);

		//Posts
		data.posts.forEach(parsePost);

		//Comments
		data.comments.forEach(parseComment);

		//Conversation message
		//* All from users
		data.all_conversation_messages.forEach(parseConversationMessage);

		//* All from conversations
		for (var num in data.conversations_messages) {
			if (data.conversations_messages.hasOwnProperty(num)) {
				var conversation = data.conversations_messages[num];
				conversation.forEach(parseConversationMessage);
			}
		}

		//Related user information
		for (var key in data.users_info) {
			if (data.users_info.hasOwnProperty(key)) {
				parseUserInfo(data.users_info[key]);
			}
		}

		return files;
	}

}