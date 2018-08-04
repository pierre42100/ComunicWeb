/**
 * Like button
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.like.button = {

	/**
	 * Display like button
	 * 
	 * @param {String} kind The kind of like component
	 * @param {int} id The ID of the component
	 * @param {int} count The current number of likes
	 * @param {Boolean} liking Specify wether user is liking the content or not
	 * @param {HTMLElement} target The target for the button
	 */
	display: function(kind, id, count, liking, target){

		//Empty target
		emptyElem(target);

		//Display like button
		var likeRoot = createElem2({
			type: "div",
			appendTo: target,
		});

		var likeLink = createElem2({
			appendTo: likeRoot,
			type: "a",
			class: "link-black text-sm"
		});

		createElem2({
			appendTo: likeLink,
			type: "i",
			class: "fa fa-thumbs-o-up margin-r-5"
		});

		var likeMsg = createElem2({
			appendTo: likeLink,
			type: "span",
		});

		//Check if user can like or not the component
		if(!signed_in()){
			
			//Remove link effect
			likeLink.style.cursor = "default";

			if(count == 0){
				//Hide like component
				likeRoot.style.visibility = "hidden";
			}

			else {
				//Update message
				if(count == 1){
					likeMsg.innerHTML = lang("like_btn_one_like");
				}
				else
					likeMsg.innerHTML = lang("like_btn_x_likes", [count]);
			}

		}

		else {

			//Update the message
			if(liking == true){
				likeMsg.innerHTML = lang("like_btn_liking")
			}
			else {
				likeMsg.innerHTML = lang("like_btn_like");
			}

			//Add total count if possible
			if(count > 0)
				likeMsg.innerHTML += " (" + count + ")";
			

			//Set onclick behaviour
			likeLink.onclick = function(){

				//Get the new status
				var newliking = liking == true ? false : true;
				count = newliking ? count  + 1 : count - 1;
				
				//Update liking status on the API
				ComunicWeb.components.like.interface.update(kind, id, newliking);

				//Display liking element again
				ComunicWeb.components.like.button.display(kind, id, count, newliking, target);

			}

		}

	},

};