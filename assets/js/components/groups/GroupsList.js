/**
 * Groups list
 * 
 * @author Pierre HUBERT
 */

class Group {
	constructor(info){
		this.id = info.id;
		this.following = info.following;
		this.icon_url = info.icon_url;
		this.membership = info.membership;
		this.name = info.name;
		this.number_members = info.number_members;
		this.posts_level = info.posts_level;
		this.registration_level = info.registration_level;
		this.virtual_directory = info.virtual_directory;
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