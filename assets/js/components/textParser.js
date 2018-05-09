/**
 * Comunic specific text parser
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.textParser = {

	/**
	 * Parse an element that contains some user input
	 * 
	 * @param {object} info Information about the element to parse
	 */
	parse: function(info){

		//Add space at the begining and the end of the content to ensure
		//parsing will not encounter errors
		info.element.innerHTML = " " + info.element.innerHTML + " ";

		//Prepare users tag parsing
		this._prepare_user_tag_parsing(info.element);

		//Parse emojies
		ComunicWeb.components.emoji.parser.parse({
			element: info.element
		});

		//Parse users tags
		this._parse_users_tag(info.element);
	},

	/**
	 * Prepare users tag parsing
	 * 
	 * @param {HTMLElement} target The target element to prepare
	 */
	_prepare_user_tag_parsing: function(target){

		//Find all occurences of users tag
		while(target.innerHTML.match(/@[a-zA-Z0-9.]+/i)){

			//Get user tag
			var userTag = target.innerHTML.match(/@[a-zA-Z0-9.]+/i)[0];
			var userID = userTag.replace("@", "");

			target.innerHTML = target.innerHTML.replace(userTag, "<userTag>"+userID+"</userTag>");

		}

	},

	/**
	 * Parse users tag
	 * 
	 * @param {HTMLElement} target The target element where user tags has
	 * to be parsed
	 */
	_parse_users_tag: function(target){

		//Get the list of user tags of the target
		var nodes = target.getElementsByTagName("userTag");

		for (var num in nodes) {
			if (nodes.hasOwnProperty(num)) {
				const node = nodes[num];
				
				//Get target user ID
				const userID = node.innerHTML;

				//Adapt node content
				node.innerHTML = "@" + userID;
				node.className = "a";

				//Small fix for iOS 9
				if(!node.addEventListener)
					continue;

				//Set event listener
				node.addEventListener("click", function(ev){

					//Open user page
					openUserPage(userID);

				});
			}
		}

	},


}