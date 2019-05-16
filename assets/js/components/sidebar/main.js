/**
 * Sidebar main script file
 * 
 * @author Pierre HUBERT
 */
ComunicWeb.components.sideBar.main = {
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
		var searchForm = createElem2({
			appendTo: section,
			type: "form",
			class: "sidebar-form",
			children: [
				createElem2({
					type: "div",
					class: "input-group",
					children: [
						createElem2({
							type: "input",
							class: "form-control",
							elemType: "text",
							placeholder: "Search...",
						}),
		
						createElem2({
							type: "span",
							class: "input-group-btn",
							innerHTML: '<button type="submit" name="search" id="search-btn" class="btn btn-flat"><i class="fa fa-search"></i></button>',
						}),
					]
				})
			]
		});

		searchForm.addEventListener("submit", function(e){
			e.preventDefault();

			openPage("search?q=" + searchForm.getElementsByTagName("input")[0].value);
		});

		// User memberships
		createElem2({
			appendTo: section,
			type: "div",
			class: "intermediate-label hide-on-collapse",
			innerHTML: "FRIENDS & GROUPS"
		});
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

	/**
	 * Refresh user memberships
	 * 
	 * @param {HTMLElement} target 
	 */
	refreshMemberships: function(target){
		ComunicWeb.components.webApp.interface.getMemberships(
			() => notify("Could not refresh your memberships!", "error"), 
			(m, u, g) => this.applyMemberships(target, m, u, g)
		);
	},

	/**
	 * Apply memberships
	 * 
	 * @param {HTMLElement} target
	 * @param {*} memberships 
	 * @param {*} users 
	 * @param {*} groups 
	 */
	applyMemberships: function(target, memberships, users, groups) {

		// Empty liste
		target.innerHTML = "";

		let friendsTarget = createElem2({
			appendTo: target,
			type: "ul", 
			class: "sidebar-menu"
		});

		memberships.forEach(e => {

			if(e.type == "friend")
				this.applyFriend(friendsTarget, e.friend, users["user-"+e.friend.ID_friend]);
			
			if(e.type == "group")
				this.applyGroup(friendsTarget, groups[e.id], e.last_activity);
		});

		$(friendsTarget).slimscroll({
			flex: 2,
			height: "100%"
		});
	},


	/**
	 * Apply a friend object
	 * 
	 * @param {HTMLElement} target 
	 * @param {*} friend 
	 * @param {*} user 
	 */
	applyFriend: function(target, friend, user) {

		let li = createElem2({
			appendTo: target,
			type: "li"
		});

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
			src: user.accountImage
		});

		// User name
		createElem2({
			appendTo: a,
			type: "span",
			innerHTML: userFullName(user)
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
	 * @param {*} group 
	 * @param {*} lastactive 
	 */
	applyGroup: function(target, group, lastactive) {
		
		let li = createElem2({
			appendTo: target,
			type: "li"
		});

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
}