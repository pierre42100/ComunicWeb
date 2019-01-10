/**
 * Dark theme component
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.darkTheme = {

	/**
	 * This variable contains the dark theme status
	 */
	_enabled: false,

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
		return this._enabled;
	},

	/**
	 * Specify whether dark theme should be enabled or not
	 * 
	 * @param {boolean} enable TRUE to enable / FALSE else
	 */
	setEnabled: function(enable){
		this._enabled = enable;

		//Check if the theme has to be disabled
		if(!this._enabled){
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