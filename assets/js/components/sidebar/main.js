/**
 * Sidebar main script file
 * 
 * @author Pierre HUBERT
 */
const SidebarMain = {
	show: function() {

		if(byId("main-sidebar")) return;

		var sideBar = createElem2({
			appendTo: byId("wrapper"),
			type: "aside",
			class: "main-sidebar",
			id: "main-sidebar",
		});

		var section = createElem2({
			appendTo: sideBar,
			type: "section",
			class: "sidebar"
		});

		// User panel
		var userPanel = createElem2({
			appendTo: section,
			type: "div",
			class: "user-panel hidden-xs"
		});

		getUserInfo(userID(), function(info){
			if(info.error)
				return userPanel.innerHTML = "Error!";
			
			// User account image
			createElem2({
				appendTo: userPanel,
				type: "div",
				class: "pull-left image cursor-pointer",
				onclick: () => openUserPage(info),
				children: [
					createElem2({
						type: "img",
						class: "img-circle",
						src: info.accountImage
					})
				],
			});

			// User name
			createElem2({
				appendTo: userPanel,
				type: "div",
				class: "pull-left info",
				children: [
					createElem2({
						type: "p",
						class: "cursor-pointer",
						innerHTML: userFullName(info),
						onclick: () => openUserPage(info),
					}),

					createElem2({
						type: "a",
						innerHTML: "Settings",
						internalHref: "settings",
					}),
				]
			});
		});



		// Search form
		this.addSearchForm(section);

		// User memberships
		/*createElem2({
			appendTo: section,
			type: "div",
			class: "intermediate-label hide-on-collapse",
			innerHTML: "FRIENDS & GROUPS"
		});*/
		let userMemberships = createElem2({
			appendTo: section,
			type: "div",
			class: "memberships-list" 
		});

		this.refreshMemberships(userMemberships);
		let interval = setInterval(() => {
			if(userMemberships.isConnected)
				this.refreshMemberships(userMemberships);
			else
				clearInterval(interval);
		}, 15000);


		/*// Recent conversations
		createElem2({
			appendTo: section,
			type: "div",
			class: "intermediate-label hide-on-collapse",
			innerHTML: "CONVERSATIONS"
		});
		let conversationsList = createElem2({
			appendTo: section,
			type: "ul",
			class: "sidebar-menu recents-conversations-list hide-on-collapse",
			innerHTML: "<li><a>TO COME</a></li>"
		});*/

	},



	// **************************************
	// 				Search
	// **************************************


	/**
	 * Add search form to sidebar
	 * 
	 * @param {HTMLElement} target The target for the search form
	 */
	addSearchForm: function(target) {


		// Search input

		/**
		 * @type {HTMLInputElement}
		 */
		let searchInput = createElem2({
			type: "input",
			class: "form-control",
			elemType: "text",
			id: "sidebarSearchInput",
			placeholder: "Search...",
		});

		let searchForm = createElem2({
			appendTo: target,
			type: "form",
			class: "sidebar-form",
			children: [
				createElem2({
					type: "div",
					class: "input-group",
					children: [
						searchInput,
		
						createElem2({
							type: "span",
							class: "input-group-btn",
							innerHTML: '<button type="submit" name="search" id="search-btn" class="btn btn-flat"><i class="fa fa-search"></i></button>',
						}),
					]
				})
			]
		});

		// Search results target
		let searchResults = createElem2({
			appendTo: searchForm,
			type: "div",
			class: "sidebar-search-results"
		});
		searchResults.style.display = "none";


		searchInput.addEventListener("keyup", e => {
			
			//Update UI
			searchResults.style.display
				 = searchInput.value.length < 2 ? "none" : "unset";

			if(searchInput.value.length < 2)
				return;

			// Perform the search on the server
			ComunicWeb.components.search.interface.global(searchInput.value, results => {
				if(results.error) return;
				
				//Get information about related groups and users
				getMultipleUsersInfo(ComunicWeb.components.search.utils.getUsersId(results), usersInfo => {
					if(usersInfo.error) return;
					
					getInfoMultipleGroups(ComunicWeb.components.search.utils.getGroupsId(results), groupsInfo => {
						if(groupsInfo.error) return;

						this.applySearchResults(searchResults, results, usersInfo, groupsInfo);
					});
				});
			});

		})

		searchForm.addEventListener("submit", e => {
			e.preventDefault();

			openPage("search?q=" + searchForm.getElementsByTagName("input")[0].value);
		});
	},


	/**
	 * Put search form back to its initial state
	 */
	resetSearchFrom: function(){
		byId("sidebarSearchInput").value = "";
		document.querySelector(".sidebar-search-results").style.display = "none";
	},

	/**
	 * Apply search results
	 * 
	 * @param {HTMLElement} target 
	 * @param {Array} results 
	 * @param {*} users 
	 * @param {*} groups 
	 */
	applySearchResults: function(target, results, users, groups) {
		emptyElem(target);

		let resultsTarget = createElem2({
			appendTo: target,
			type: "div",
			class: "results-container"
		});

		results.forEach(el => {
			
			if(el.kind == "user")
				this.applyUserResult(resultsTarget, users["user-" + el.id]);
			
			else
				this.applyGroupResult(resultsTarget, groups[el.id]);

		});

		$(resultsTarget).slimScroll({
			height: '100%'
		});
	},


	applyUserResult: function(target, user) {

		createElem2({
			appendTo: target,
			type: "div",
			children: [
				createElem2({
					type: "img",
					class: "img-circle",
					src: user.accountImage
				}),

				createElem2({
					type: "span",
					innerHTML: userFullName(user)
				}),
			],
			onclick: () => {
				openUserPage(user);
				this.resetSearchFrom();
			}
		});

	},


	applyGroupResult: function(target, group) {
		createElem2({
			appendTo: target,
			type: "div",
			children: [
				createElem2({
					type: "img",
					src: group.icon_url
				}),

				createElem2({
					type: "span",
					innerHTML: group.name
				}),
			],
			onclick: () => {
				openGroupPage(group);
				this.resetSearchFrom();
			}
		});
	},






	// **************************************
	// 				Memberships
	// **************************************

	/**
	 * Refresh user memberships
	 * 
	 * @param {HTMLElement} target 
	 */
	refreshMemberships: function(target){
		WebAppInterface.getMemberships(
			() => notify("Could not refresh your memberships!", "error"), 
			(m, u, g, c) => this.applyMemberships(target, m, u, g, c)
		);
	},

	/**
	 * Apply memberships
	 * 
	 * @param {HTMLElement} target
	 * @param {UserMembership[]} memberships 
	 * @param {UsersList} users 
	 * @param {*} groups 
	 * @param {Map<number, String>} convs
	 */
	applyMemberships: function(target, memberships, users, groups, convs) {

		// Empty list
		target.innerHTML = "";

		let friendsTarget = createElem2({
			appendTo: target,
			type: "ul", 
			class: "sidebar-menu"
		});

		memberships.forEach(e => {

			if(e.type == "friend")
				this.applyFriend(friendsTarget, e.friend, users.get(e.friend.ID_friend));
			
			if(e.type == "group")
				this.applyGroup(friendsTarget, groups.get(e.id), e.last_activity);
			
			if(e.type == "conversation")
				this.applyConversation(friendsTarget, e.conv, convs.get(e.conv.id));
		});

		createElem2({
			appendTo: friendsTarget,
			type: "li",
			innerHTML: "<div style='height: 50px'></div>",
		});

		$(friendsTarget).slimscroll({
			flex: 2,
			height: "100%"
		});

		// Highlight active element
		SidebarMain.refreshActiveElement()
	},


	/**
	 * Apply a friend object
	 * 
	 * @param {HTMLElement} target 
	 * @param {*} friend 
	 * @param {User} user 
	 */
	applyFriend: function(target, friend, user) {

		let li = createElem2({
			appendTo: target,
			type: "li"
		});
		li.setAttribute("data-membership-user-id", user.id)

		if(user.hasVirtualDirectory)
			li.setAttribute("data-membership-dir", user.virtualDirectory)


		let a = createElem2({
			appendTo: li,
			onclick: () => openUserPage(user),
			type: "a"
		});

		// User icon
		createElem2({
			appendTo: a,
			type: "img",
			class: "img-circle",
			src: user.image
		});

		// User name
		createElem2({
			appendTo: a,
			type: "span",
			innerHTML: userFullName(user)
		});

		// Private conversation
		createElem2({
			appendTo: a,
			type: "span",
			class: "pull-right-container",
			innerHTML: "<small class='label pull-right'><i class='fa fa-comments'></i></small>",
			onclick: (e) => {
				e.stopImmediatePropagation();
				ComunicWeb.components.conversations.manager.openPrivate(user.id);
			}
		});

		// Supplementary information
		let subInfoEl = createElem2({
			appendTo: a,
			type: "div",
			class: "subinfo",
			onclick: friend.accepted != 1 ? (e) => e.stopImmediatePropagation() : undefined
		});

		// Check if friendship request has been accepted or not
		if(friend.accepted == 1) {
			if(ComunicWeb.common.date.time() - friend.time_last_activity < 30)
				subInfoEl.innerHTML = "<span style='color: green;'>Online</span>";
			else
				subInfoEl.innerHTML = timeDiffToStr(friend.time_last_activity);
		}

		else {

			const respondRequest = function(accept) {

				// Update UI
				subInfoEl.innerHTML = accept ? lang("friends_bar_accepted") 
					: lang("friends_bar_rejected");
				if(!accept) li.remove();

				// Perform the request the server
				ComunicWeb.components.friends.list.respondRequest(friend.ID_friend, accept);

			}

			// Offer the user to accept or reject the invitation
			createElem2({
				appendTo: subInfoEl, 
				type: "span",
				class: "btn btn-success btn-xs",
				innerHTML: "<i class='fa fa-check'></i>",
				onclick: (e) => respondRequest(true)
			});

			add_space(subInfoEl);

			createElem2({
				appendTo: subInfoEl, 
				type: "span",
				class: "btn btn-danger btn-xs",
				innerHTML: "<i class='fa fa-close'></i>",
				onclick: (e) => respondRequest(false)
			});
		}
	},

	/**
	 * Apply group information
	 * 
	 * @param {HTMLElement} target 
	 * @param {Group} group 
	 * @param {*} lastactive 
	 */
	applyGroup: function(target, group, lastactive) {
		
		let li = createElem2({
			appendTo: target,
			type: "li"
		});
		li.setAttribute("data-membership-group-id", group.id)

		if(group.hasVirtualDirectory)
			li.setAttribute("data-membership-dir", group.virtual_directory)

		let a = createElem2({
			appendTo: li,
			type: "a",
			onclick: () => openGroupPage(group)
		});

		// Group icon
		createElem2({
			appendTo: a,
			type: "img",
			src: group.icon_url
		});

		// Group name
		createElem2({
			appendTo: a,
			type: "span",
			innerHTML: group.name
		});

		let subInfoEl = createElem2({
			appendTo: a,
			type: "div",
			class: "subinfo",
			//onclick: (e) => e.stopImmediatePropagation()
		});

		if(group.membership == "pending") {

			// Show requested state
			subInfoEl.innerHTML = "Requested";
		}
		else if(group.membership == "invited") {

			// Show invited state
			subInfoEl.innerHTML = "<i class='fa fa-question'></i> Invited";

		}
		else
			// Group last activity
			subInfoEl.innerHTML = timeDiffToStr(lastactive);

	},

	/**
	 * Apply a conversation
	 * 
	 * @param {HTMLElement} target
	 * @param {Conversation} conv
	 * @param {String} name
	 */
	applyConversation: function(target, conv, name) {

		let li = createElem2({
			appendTo: target,
			type: "li",
			class: "conversation_memberhsip"
		});
		li.setAttribute("data-membership-conv-id", conv.id)

		// Check for unread messages
		if(conv.last_activity > conv.members.find(m => m.user_id == userID()).last_access) {
			li.classList.add("has-unread-msg");
		}

		let a = createElem2({
			appendTo: li,
			type: "a",
			onclick: () => openConversation(conv.id, true)
		});

		// Icon
		createElem2({
			appendTo: a,
			type: "i",
			class: "fa fa-comments"
		});

		// Conversation name
		createElem2({
			appendTo: a,
			type: "span",
			innerHTML: name
		});

		let subInfoEl = createElem2({
			appendTo: a,
			type: "div",
			class: "subinfo",
			innerHTML: timeDiffToStr(conv.last_activity)
		});


		// Check if there is an ongoing call on the conversation
		if(conv.has_call_now) {
			
			li.classList.add("with-call");

			let callLi = createElem2({
				appendTo: target,
				type: "li",
				class: "call_notice"
			});

			let a = createElem2({
				appendTo: callLi,
				type: "a",
				onclick: () => CallsController.Open(conv),
				innerHTML: "<i class='fa fa-phone'></i> <span>Ongoing call</span>"
			});
		}
	},

	/**
	 * Refresh currently active element in the sidebar
	 */
	refreshActiveElement: function() {
		// Search for target
		const list = document.querySelector(".memberships-list");
		if(!list)
			return;
		
		// Remove previously active element (if any)
		const activeElem = list.querySelector("li.active");
		if(activeElem)
			activeElem.classList.remove("active")
		
		// Check for target element
		const currPage = ComunicWeb.common.url.getCurrentWebsiteURL();

		let query = false;

		// Friends
		if(currPage.startsWith("user/"))
			query = "[data-membership-user-id=\""+currPage.split("/")[1].split("#")[0]+"\"]"

		// Groups
		else if(currPage.startsWith("groups/"))
			query = "[data-membership-group-id=\""+currPage.split("/")[1].split("#")[0]+"\"]"

		// Conversations
		else if(currPage.startsWith("conversations/"))
			query = "[data-membership-conv-id=\""+currPage.split("/")[1].split("#")[0]+"\"]"
		
		// Search by virtual directory
		else {
			query = "[data-membership-dir=\""+currPage.split("/")[0].split("?")[0].split("#")[0]+"\"]";
		}


		// Query element
		const target = list.querySelector(query);
		if(target)
			target.classList.add("active");
	},
}

ComunicWeb.components.sideBar.main = SidebarMain

// Register to page change events (to refresh active element)
document.addEventListener("openPage", (e) => {
	SidebarMain.refreshActiveElement()
})