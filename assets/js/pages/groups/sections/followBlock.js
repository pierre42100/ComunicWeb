/**
 * Group follow state update block
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.pages.groups.sections.followBlock = {

	/**
	 * Display the block
	 * 
	 * @param {Object} info Information about the target group
	 * @param {HTMLElement} target The target for the block
	 */
	display: function(info, target){
		this._show_block(info.id, info.following, target);
	},

	/**
	 * Display follow block
	 * 
	 * @param {Number} groupID The ID of the target group
	 * @param {boolean} following TRUE if the user is following the group / FALSE else
	 * @param {HTMLElement} target The target for the page
	 */
	_show_block: function(groupID, following, target){
		
		if(!target.className.includes("follow-group-btn"))
			var followButton = createElem2({
				appendTo: target,
				type: "div",
				class: "follow-group-btn a"
			});
		
		else {
			emptyElem(target);
			var followButton = target;
		}

		//Adapt follow button content
		followButton.innerHTML = following ? 
			"<i class='fa fa-check'></i> Following" 
			: "<i class='fa fa-newspaper-o'></i> Follow";

		
		//Make button lives
		followButton.onclick = function(){

			//Make a request on the API
			ComunicWeb.components.groups.interface.setFollowing(groupID, !following, function(result){

				//Check for errors
				if(result.error)
					return notify("Could not update your following status of the group!", "danger");

				//Show block with new status
				ComunicWeb.pages.groups.sections.followBlock._show_block(groupID, !following, followButton);
			});


		};
	}

};