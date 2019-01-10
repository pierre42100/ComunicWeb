/**
 * Dark theme component
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.darkTheme = {

	/**
	 * Specify whether dark theme has to be enabled or not
	 */
	_local_storage_name: "dark_theme_mode",

	/**
	 * CSS element that contains dark theme CSS rules
	 */
	_cssElem: null,

	/**
	 * Check out whether dark theme is enabled or not
	 * 
	 * @return {boolean} TRUE if enabled / FALSE else
	 */
	isEnabled: function(){
		return localStorage.getItem(this._local_storage_name) == "true";
	},

	/**
	 * Specify whether dark theme should be enabled or not
	 * 
	 * @param {boolean} enable TRUE to enable / FALSE else
	 */
	setEnabled: function(enable){
		localStorage.setItem(this._local_storage_name, enable ? "true" : "false");
		
		this.refresh();
	},
	
	/**
	 * Refresh dark theme state
	 */
	refresh: function(){

		//Check if the theme has to be disabled
		if(!this.isEnabled()){
			if(this._cssElem != null)
				this._cssElem.disabled = true;
			return;
		}

		//Check if CSS element is already loaded
		else if(this._cssElem != null)
			this._cssElem.disabled = false;
		
		//We need to load dark theme
		else {

			this._cssElem = createElem2({
				type: "link",
				href: ComunicWeb.__config.assetsURL + "css/dark_theme.css"
			});
			this._cssElem.setAttribute("rel", "stylesheet");
			document.head.appendChild(this._cssElem);
		}
	}
}