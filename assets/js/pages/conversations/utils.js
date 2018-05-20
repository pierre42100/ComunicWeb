/**
 * Conversation page utilities
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.pages.conversations.utils = {

	/**
	 * Enable slimscroll for the conversation element
	 * 
	 * @param {HMTLElement} target The target for slimscroll
	 * @param {Number} height The available height for the element
	 * @param {Number} pos Scroll position to go to
	 */
	enableSlimScroll: function(target, height, pos){

		$(target).slimScroll({
			scrollTo: pos + "px",
			height: height + "px",
		});
	},

	/**
	 * Get the available height for the conversations
	 * 
	 * @return {Number} The available height, in pixel
	 */
	getAvailableHeight: function(){
		return Number(byId("pageTarget").style.minHeight.replace("px", "")) - 180;
	}

}