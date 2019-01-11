/**
 * Incognito mode management
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.incognito.ui = {

	/**
	 * Initialize UI component
	 */
	init: function(){

		//Initialize incognito mode updates detection
		document.addEventListener("incognitoStatusChanged", function(e){
			ComunicWeb.components.incognito.ui.statusChanged();
		})

		document.addEventListener("openPage", function(){
			ComunicWeb.components.incognito.ui.statusChanged();
		});
	},

	/**
	 * Show confirmation dialog to enable incognito mode
	 */
	confirmEnable: function(){

		//Ask user confirmation
		ComunicWeb.common.messages.confirm(
			"Are you sure do you want to enable incognito mode? When this mode is enabled, you can use Comunic while appearing as disconnected for your friends...",
			function(confirm){
				
				if(!confirm)
					return;
				
				//Enable incognito mode
				ComunicWeb.components.incognito.management.setEnabled(true);

			});

	},

	/**
	 * Function called each time incognito status is updated
	 */
	statusChanged: function(){

		var enabled = ComunicWeb.components.incognito.management.isEnabled();
		var incognitoBlock = byId("incognito-block");

		//Check if incognito mode is disabled
		if(!enabled){

			if(incognitoBlock != null)
				//Remove incognito block
				incognitoBlock.remove();

			return;
		}
		
		//Nothing has to done if incognito block is already visible
		if(incognitoBlock)
			return;
		
		//Create incognito block
		incognitoBlock = createElem2({
			type: "div",
			appendTo: document.body,
			id: "incognito-block",
		});

		createElem2({
			type: "i",
			appendTo: incognitoBlock,
			class: "fa fa-user-secret",
		});

		createElem2({
			type: "span",
			appendTo: incognitoBlock,
			innerHTML: "Incognito mode"
		});

		var disableLink = createElem2({
			type: "span",
			appendTo: incognitoBlock,
			class: "a",
			innerHTML: "Disable"
		});

		disableLink.addEventListener("click", function(){
			ComunicWeb.components.incognito.management.setEnabled(false);
		})
	}

}