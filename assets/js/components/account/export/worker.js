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
			ComunicWeb.components.account.export.ui.updateProgress(10);

			//Parse data
			ComunicWeb.components.account.export.worker.parse(data);
		});

	},

	/**
	 * Parse account text data
	 * 
	 * @param {Object} data Text data about the account
	 */
	parse: function(data){
		alert("Parse text data");
	}

}