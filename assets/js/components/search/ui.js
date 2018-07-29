/**
 * Search users UI
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.search.ui = {
	
	/**
	 * Display search result
	 * 
	 * @param {Object} info Information about the result to display
	 * @param {Object} usersInfo Information about related users
	 * @param {Object} groupsInfo Information about related groups
	 * @param {Function} callback Additionnal function to call when the
	 * user has selected an option (can be null)
	 * @param {HTMLElement} target
	 */
	display: function(info, usersInfo, groupsInfo, callback, target){

		//Create user element
		var resultListEl = createElem("li", target);
		var resultLinkElement = createElem("a", resultListEl);
		
		//User account image
		var resultImageContainer = createElem2({
			appendTo: resultLinkElement,
			type: "div",
			class: "pull-left"
		});

		var resultImage = createElem2({
			appendTo: resultImageContainer,
			type: "img",
			class: "img-circle"
		});

		//User name
		var resultName = createElem2({
			appendTo: resultLinkElement,
			type: "h4",
			innerHTML: "Loading..."
		});

		//Get information about the result
		if(info.kind == "user"){

			var userInfo = usersInfo["user-"+info.id];
			
			resultImage.src = userInfo.accountImage;
			resultName.innerHTML = userFullName(userInfo);
			
			resultLinkElement.addEventListener("click", function(){
				openUserPage(userInfo);
			});
		}

		if(info.kind == "group"){

			var groupInfo = groupsInfo[info.id];
			
			resultImage.src = groupInfo.icon_url;
			resultName.innerHTML = groupInfo.name;

			resultLinkElement.addEventListener("click", function(){
				openGroupPage(groupInfo);
			})
		}
			

		//Make user link element live
		resultLinkElement.addEventListener("click", function() {
			
			if(callback)
				callback();

		});

	}

}