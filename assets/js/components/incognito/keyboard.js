/**
 * Incognito mode keyboard catcher
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.incognito.keyboard = {

	/**
	 * Initialize incognito mode requests detection
	 */
	init: function(){

		//We need to catch keyboard press to check if F6 key is pressed
		window.addEventListener("keydown", function(e){
			
			//Filter key
			if(e.keyCode != 117)
				return;
			
			//If incognito mode is enabled, disable it
			if(ComunicWeb.components.incognito.management.isEnabled())
				ComunicWeb.components.incognito.management.setEnabled(false);
			
			//Else we ask user confirmation
			else 
				ComunicWeb.components.incognito.ui.confirmEnable();
			
		});
	}
}