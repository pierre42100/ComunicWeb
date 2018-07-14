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

		//Prepare URL parsing
		this._prepare_url_tag_parsing(info.element);

		//Parse emojies
		ComunicWeb.components.emoji.parser.parse({
			element: info.element
		});

		//Parse users tags
		this._parse_users_tag(info.element);

		//Parse URLs
		this._parse_urls(info.element);
	},

	/**
	 * Prepare users tag parsing
	 * 
	 * @param {HTMLElement} target The target element to prepare
	 */
	_prepare_user_tag_parsing: function(target){

		//Find all occurences of users tag
		while(target.innerHTML.match(/ @[a-zA-Z0-9.]+/i)){

			//Get user tag
			var userTag = target.innerHTML.match(/ @[a-zA-Z0-9.]+/i)[0];
			var userID = userTag.replace(" @", "");

			target.innerHTML = target.innerHTML.replace(userTag, " <userTag>"+userID+"</userTag>");

		}

	},

	/**
	 * Prepare URL parsing
	 * 
	 * @param {HTMLElement} target The target element to prepare
	 */
	_prepare_url_tag_parsing: function(target){

		//Find all occurences of users tag
		while(target.innerHTML.match(/ [a-zA-Z]{2,5}:\/\/[a-zA-Z0-9.=@\?\-\_\&\;:\/]+/i)){

			//Get URL and save it
			var URL = target.innerHTML.match(/ [a-zA-Z]{2,5}:\/\/[a-zA-Z0-9.=@\?\-\_\&\;:\/]+/i)[0];
			tempURL = URL.replace("://", ":/");
			target.innerHTML = target.innerHTML.replace(URL, "<innerURL>"+tempURL+"</innerURL>");

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
					openPage(userID);

				});
			}
		}

	},

	/**
	 * Parse URLs
	 * 
	 * @param {HTMLElement} target The target element where URLs
	 * to be parsed
	 */
	_parse_urls: function(target){

		//Get the list of user tags of the target
		var nodes = target.getElementsByTagName("innerURL");

		for (var num in nodes) {
			if (nodes.hasOwnProperty(num)) {
				const node = nodes[num];

				//Small fix for iOS 9
				if(!node.addEventListener)
					continue;
				
				//Get target URL
				var url = node.innerHTML;
				url = url.replace(":/", "://");

				//Adapt node
				node.innerHTML = "<a href='" + url + "' target='_blank'>" + url + "</a>";
			}
		}

	},


}