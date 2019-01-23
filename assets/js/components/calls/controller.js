/**
 * Calls controller
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.calls.controller = {

	/**
	 * This variable contains the initialization state
	 * of the call component
	 */
	_is_init: false,

	/**
	 * Initialize calls component
	 */
	init: function(){
	
		//We init this component just once
		if(this._is_init)
			return;

		ComunicWeb.debug.logMessage("Initialize calls component");

		//We wait the user to be connected before trying to get
		// call configuration
		document.addEventListener("got_user_id", function(){

			//Check if we have already the call configuration
			if(ComunicWeb.components.calls.__config !== undefined)
				return;
			
			ComunicWeb.components.calls.interface.getConfig(function(config){

				//Check if we could not get calls configuration
				if(config.error)
					return;

				//Save calls configuration
				ComunicWeb.components.calls.__config = config;
			});

		});
	}

}