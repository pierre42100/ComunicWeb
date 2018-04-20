/**
 * Emojies picker
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.emoji.picker = {

	//Source code of the emojies picker
	pickerSrc: '<div class="wdt-emoji-popup">'+
	'<a href="#" class="wdt-emoji-popup-mobile-closer"> &times; </a>' +
	'<div class="wdt-emoji-menu-content">' +
	'	<div id="wdt-emoji-menu-header">' +
	'		<a class="wdt-emoji-tab active" data-group-name="Recent"></a>' +
	'		<a class="wdt-emoji-tab" data-group-name="People"></a>' +
	'		<a class="wdt-emoji-tab" data-group-name="Nature"></a>' +
	'		<a class="wdt-emoji-tab" data-group-name="Foods"></a>' +
	'		<a class="wdt-emoji-tab" data-group-name="Activity"></a>' +
	'		<a class="wdt-emoji-tab" data-group-name="Places"></a>' +
	'		<a class="wdt-emoji-tab" data-group-name="Objects"></a>' +
	'		<a class="wdt-emoji-tab" data-group-name="Symbols"></a>' +
	'		<a class="wdt-emoji-tab" data-group-name="Flags"></a>' +
	'		<a class="wdt-emoji-tab" data-group-name="Custom"></a>' +
	'	</div>' +
	'	<div class="wdt-emoji-scroll-wrapper">' +
	'		<div id="wdt-emoji-menu-items">' +
	'			<input id="wdt-emoji-search" type="text" placeholder="Search">' +
	'			<h3 id="wdt-emoji-search-result-title">Search Results</h3>' +
	'			<div class="wdt-emoji-sections"></div>' +
	'			<div id="wdt-emoji-no-result">No emoji found</div>' +
	'		</div>' +
	'	</div>' +
	'	<div id="wdt-emoji-footer">' +
	'		<div id="wdt-emoji-preview">' +
	'			<span id="wdt-emoji-preview-img"></span>' +
	'			<div id="wdt-emoji-preview-text">' +
	'				<span id="wdt-emoji-preview-name"></span><br>' +
	'				<span id="wdt-emoji-preview-aliases"></span>' +
	'			</div>' +
	'		</div>' +

	'		<div id="wdt-emoji-preview-bundle">' +
	'			<span>WDT Emoji Bundle</span>' +
	'		</div>' +
	'	</div>' +
	'</div>' +
	'</div>";',


	/**
	 * Initialize Emojie picker
	 */
	init: function(){

		//Check if the picker has to be included in the page
		var targetPicker = byId("emojiPicker");
		if(!targetPicker){

			targetPicker = createElem2({
				appendTo: byId("wrapper"),
				type: "div",
				id: "emojiPicker",
				innerHTML: this.pickerSrc
			});

			wdtEmojiBundle.defaults.emojiSheets.twitter = ComunicWeb.__config.assetsURL + "3rdparty/wdt-emoji/sheets/sheet_twitter_64_indexed_128.png";
			wdtEmojiBundle.init('.wdt-emoji-bundle-enabled');
			wdtEmojiBundle.changeType("twitter");
		
		}
	},

	/**
	 * Add a picker for an element
	 * 
	 * @param {HTMLElement} elem Target element
	 * @param {HTMLElement} trigger Alternative element to trigger picker
	 */
	addPicker: function(elem, trigger){

		//Make sure the system is ready
		this.init();

		//Check if the default features of the framework can be used
		if(!trigger){
			wdtEmojiBundle.addPicker(elem);
			return;
		}

		trigger.addEventListener('click', wdtEmojiBundle.openPicker);

		var parent = elem.parentNode;
		parent.className += ' wdt-emoji-picker-parent';
		if (elem.className.includes('wdt-emoji-open-on-colon')) {
			parent.addEventListener('keyup', wdtEmojiBundle.onKeyup)
		}
		elem.className += ' wdt-emoji-bundle-enabled wdt-emoji-picker-ready';
	}

}