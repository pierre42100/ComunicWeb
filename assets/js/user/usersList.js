/**
 * Users list
 * 
 * Contains a list of users
 * 
 * @author Pierre HUBERT
 */

/**
 * User class - contains information about a single user
 */
class User {
	constructor(info){
		this.virtualDirectory = info.virtualDirectory;
		this.image = info.accountImage;
		this.firstName = info.firstName;
		this.lastName = info.lastName;
		this.isOpen = info.openPage == "true";
		this.isPublic = info.publicPage == "true";
		this.id = info.userID;
	}

	/**
	 * Backward compatibility
	 */
	get userID() {
		return this.id
	}

	/**
	 * Get the full name of the user
	 */
	get fullName() {
		return this.firstName + " " + this.lastName;
	}

	/**
	 * Check out whether a given user has a virtual directory or not
	 */
	get hasVirtualDirectory() {
		return this.virtualDirectory;
	}
}

class UsersList {

	/**
	 * Initialize a list of users using the legacy users system
	 * 
	 * @param {Users} list The list of users to add
	 */
	constructor(list){
		
		/**
		 * @type {User[]}
		 */
		this.list = [];
		
		for (const num in list) {
			if (list.hasOwnProperty(num)) {
				this.list.push(new User(list[num]));
				
			}
		}
	}


	/**
	 * Find and returns a user specified by its ID
	 * 
	 * @param {Number} id The ID of the user to get
	 * @return {User} target user / null in case of failure
	 */
	get(id){
		for (const num in this.list) {
			if (this.list.hasOwnProperty(num)) {
				const user = this.list[num];
				
				if(user.id == id)
					return user;
			}
		}
	}
}