/**
 * Groups list
 * 
 * @author Pierre HUBERT
 */

class Group {
	constructor(info){

		/** @type {Number} */
		this.id = info.id;

		/** @type {Boolean} */
		this.following = info.following;

		/** @type {String} */
		this.icon_url = info.icon_url;

		/** @type {"administrator"|"moderator"|"member"|"invited"|"pending"|"visitor"} */
		this.membership = info.membership;

		/** @type {String} */
		this.name = info.name;

		/** @type {Number} */
		this.number_members = info.number_members;
		
		/** @type {"moderators"|"members"} */
		this.posts_level = info.posts_level;

		/** @type {"open"|"moderated"|"closed"} */
		this.registration_level = info.registration_level;

		/** @type {String} */
		this.virtual_directory = info.virtual_directory;

		/** @type {"open"|"private"|"secrete"} */
		this.visibility = info.visibility;
	}

	get hasVirtualDirectory() {
		return this.virtual_directory;
	}
}

class GroupsList {

	constructor(list){

		/**
		 * @type {Group[]}
		 */
		this.list = [];

		// Initialize the list of groups
		for (const key in list) {
			if (list.hasOwnProperty(key))
				this.list.push(new Group(list[key]));
		}
	}

	/**
	 * Get a group specified by its ID
	 * 
	 * @param {Number} id The ID of the target group
	 * @return {Group} information about the target group
	 */
	get(id){
		for (let index = 0; index < this.list.length; index++) {
			const group = this.list[index];
			if(group.id == id)
				return group;
		}
	}
}